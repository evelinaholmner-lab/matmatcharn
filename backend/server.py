from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# LLM key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class MenuGenerateRequest(BaseModel):
    numberOfPeople: int
    dietaryPreferences: List[str]  # Flerval: 'allatare', 'pescetariansk', 'flexitariansk', 'vegetarian', 'vegan', 'keto', 'lchf'
    allergies: List[str]
    location: str
    selectedStores: List[str]
    selectedMeals: List[str] = ['frukost', 'lunch', 'middag']  # Vilka måltider per dag
    lunchboxCount: int = 0  # Antal matlådor
    wantsBatchCooking: bool = False  # Preppa/batch-laga
    discounts: List[dict]  # Lista med rabatter från butikerna

class MenuResponse(BaseModel):
    weeklyMenu: dict
    shoppingList: dict
    totalEstimate: str
    savings: str
    recipeTips: List[dict]


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


@api_router.post("/generate-menu")
async def generate_menu(request: MenuGenerateRequest):
    """Generate a weekly menu using AI based on user preferences and discounts"""
    
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    
    # Format discounts for the prompt
    discounts_text = ""
    for store in request.selectedStores:
        store_discounts = [d for d in request.discounts if d.get('store') == store]
        if store_discounts:
            discounts_text += f"\n\n**{store}:**\n"
            for d in store_discounts[:20]:  # Limit to 20 per store
                discounts_text += f"- {d.get('name', 'Okänd produkt')}: {d.get('price', 'N/A')} (rabatt: {d.get('discount', 'N/A')})\n"
    
    # Map dietary preference to Swedish
    diet_map = {
        'allatare': 'Allätare (allt går bra)',
        'pescetariansk': 'Pescetariansk (ingen kött, fisk ok)',
        'flexitariansk': 'Flexitariansk (mestadels vegetariskt)'
    }
    diet_text = diet_map.get(request.dietaryPreference, request.dietaryPreference)
    
    # Map allergies to Swedish
    allergy_map = {
        'gluten': 'Gluten',
        'laktos': 'Laktos',
        'mjolkprotein': 'Mjölkprotein',
        'agg': 'Ägg',
        'notter': 'Nötter',
        'soja': 'Soja',
        'fisk': 'Fisk',
        'skaldjur': 'Skaldjur',
        'sesam': 'Sesam'
    }
    allergies_text = ', '.join([allergy_map.get(a, a) for a in request.allergies]) if request.allergies else 'Inga'
    
    system_message = """Du är en smart veckomeny-assistent för Umeå-området som skapar personliga, optimerade veckomenyer. 

Du MÅSTE svara i exakt detta JSON-format (ingen annan text):
{
  "weeklyMenu": {
    "monday": {"breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..."},
    "tuesday": {"breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..."},
    "wednesday": {"breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..."},
    "thursday": {"breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..."},
    "friday": {"breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..."},
    "saturday": {"breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..."},
    "sunday": {"breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..."}
  },
  "shoppingList": {
    "BUTIK_NAMN": [
      {"item": "Produktnamn", "amount": "Mängd", "price": "Pris"},
      ...
    ]
  },
  "totalEstimate": "XXX kr",
  "savings": "XXX kr",
  "recipeTips": [
    {"title": "Receptnamn", "ingredients": ["ing1", "ing2"], "steps": ["steg1", "steg2", "steg3"]},
    ...
  ]
}

Prioritera ALLTID:
- Ekonomiskt: Maximera användning av rabatter
- Tidssparande: Minimera antal butiker (1-2 huvudbutiker)
- Variation: Blanda kött/fisk/vego, inte samma rätt i rad
- Realistiskt: Enkla vardagsrätter, rätt portioner"""

    user_prompt = f"""Skapa en veckomeny för vecka 7 (9-15 februari 2025).

**ANVÄNDARENS VAL:**
- Ort: {request.location}
- Antal personer: {request.numberOfPeople}
- Kostpreferens: {diet_text}
- Allergier: {allergies_text}
- Valda butiker: {', '.join(request.selectedStores)}

**AKTUELLA RABATTER:**
{discounts_text}

Skapa en balanserad veckomeny med frukost, lunch, middag och mellanmål för alla 7 dagar.
Prioritera rabatterade produkter (minst 60-70% av ingredienserna).
Anpassa portioner för {request.numberOfPeople} personer.
Undvik produkter som innehåller: {allergies_text}.

Svara ENDAST med JSON enligt formatet ovan."""

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"menu-gen-{uuid.uuid4()}",
            system_message=system_message
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(text=user_prompt)
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        import json
        # Clean response - remove markdown code blocks if present
        clean_response = response.strip()
        if clean_response.startswith("```json"):
            clean_response = clean_response[7:]
        if clean_response.startswith("```"):
            clean_response = clean_response[3:]
        if clean_response.endswith("```"):
            clean_response = clean_response[:-3]
        clean_response = clean_response.strip()
        
        menu_data = json.loads(clean_response)
        
        return menu_data
        
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse LLM response as JSON: {e}")
        logging.error(f"Response was: {response[:500] if response else 'None'}")
        raise HTTPException(status_code=500, detail="Failed to parse menu response")
    except Exception as e:
        logging.error(f"Error generating menu: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate menu: {str(e)}")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
