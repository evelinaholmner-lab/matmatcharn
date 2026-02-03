import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WeeklyMealPlan, ShoppingList, Recipe, DayMeal, DayPlan, Store, MealType, ShoppingItem, IngredientCategory } from '../types';
import { recipes } from '../data/recipes';
import { campaigns, getCampaignForIngredient } from '../data/campaigns';
import { startOfWeek, addDays } from 'date-fns';

// Mapping för att kategorisera ingredienser
const ingredientCategoryMap: Record<string, IngredientCategory> = {
  // Mejeri
  'mjölk': 'Mejeri', 'grädde': 'Mejeri', 'smör': 'Mejeri', 'ost': 'Mejeri',
  'yoghurt': 'Mejeri', 'filmjölk': 'Mejeri', 'kesella': 'Mejeri', 'ricotta': 'Mejeri',
  'mozzarella': 'Mejeri', 'parmesan': 'Mejeri', 'cheddar': 'Mejeri', 'fetaost': 'Mejeri',
  'halloumi': 'Mejeri', 'crème fraiche': 'Mejeri', 'gräddfil': 'Mejeri', 'cottage cheese': 'Mejeri',
  'brie': 'Mejeri', 'blåmögelost': 'Mejeri', 'ägg': 'Mejeri', 'havremjölk': 'Mejeri',
  'mandelmjölk': 'Mejeri', 'kokosmjölk': 'Mejeri', 'kokosyoghurt': 'Mejeri',
  'grekisk yoghurt': 'Mejeri', 'tzatziki': 'Mejeri',
  
  // Kött & Fågel
  'kycklingfilé': 'Kött & Fågel', 'kyckling': 'Kött & Fågel', 'nötfärs': 'Kött & Fågel',
  'köttfärs': 'Kött & Fågel', 'fläskfilé': 'Kött & Fågel', 'bacon': 'Kött & Fågel',
  'skinka': 'Kött & Fågel', 'korv': 'Kött & Fågel', 'falukorv': 'Kött & Fågel',
  'entrecôte': 'Kött & Fågel', 'lammracks': 'Kött & Fågel', 'älgfärs': 'Kött & Fågel',
  'fläsk': 'Kött & Fågel', 'kalops kött': 'Kött & Fågel', 'hel kyckling': 'Kött & Fågel',
  'sojabiffar': 'Kött & Fågel',
  
  // Fisk & Skaldjur
  'lax': 'Fisk & Skaldjur', 'laxfilé': 'Fisk & Skaldjur', 'torsk': 'Fisk & Skaldjur',
  'torskfilé': 'Fisk & Skaldjur', 'räkor': 'Fisk & Skaldjur', 'handskalade räkor': 'Fisk & Skaldjur',
  'tonfisk': 'Fisk & Skaldjur', 'färsk tonfisk': 'Fisk & Skaldjur', 'löjrom': 'Fisk & Skaldjur',
  'kalles kaviar': 'Fisk & Skaldjur', 'fiskbuljong': 'Fisk & Skaldjur',
  
  // Frukt & Grönt
  'tomat': 'Frukt & Grönt', 'gurka': 'Frukt & Grönt', 'paprika': 'Frukt & Grönt',
  'lök': 'Frukt & Grönt', 'vitlök': 'Frukt & Grönt', 'morot': 'Frukt & Grönt',
  'potatis': 'Frukt & Grönt', 'broccoli': 'Frukt & Grönt', 'spenat': 'Frukt & Grönt',
  'sallad': 'Frukt & Grönt', 'avokado': 'Frukt & Grönt', 'banan': 'Frukt & Grönt',
  'äpple': 'Frukt & Grönt', 'apelsin': 'Frukt & Grönt', 'citron': 'Frukt & Grönt',
  'lime': 'Frukt & Grönt', 'blåbär': 'Frukt & Grönt', 'jordgubbar': 'Frukt & Grönt',
  'hallon': 'Frukt & Grönt', 'mango': 'Frukt & Grönt', 'kiwi': 'Frukt & Grönt',
  'ananas': 'Frukt & Grönt', 'melon': 'Frukt & Grönt', 'vindruvor': 'Frukt & Grönt',
  'druvor': 'Frukt & Grönt', 'päron': 'Frukt & Grönt', 'champinjoner': 'Frukt & Grönt',
  'purjolök': 'Frukt & Grönt', 'selleri': 'Frukt & Grönt', 'zucchini': 'Frukt & Grönt',
  'aubergine': 'Frukt & Grönt', 'sötpotatis': 'Frukt & Grönt', 'palsternacka': 'Frukt & Grönt',
  'rotselleri': 'Frukt & Grönt', 'rödbetor': 'Frukt & Grönt', 'rödkål': 'Frukt & Grönt',
  'gröna bönor': 'Frukt & Grönt', 'oliver': 'Frukt & Grönt', 'körsbärstomater': 'Frukt & Grönt',
  'romansallad': 'Frukt & Grönt', 'rucola': 'Frukt & Grönt', 'rädisor': 'Frukt & Grönt',
  'vårlök': 'Frukt & Grönt', 'färskpotatis': 'Frukt & Grönt', 'frysta bär': 'Frukt & Grönt',
  'passionsfrukt': 'Frukt & Grönt', 'acaibär fryst': 'Frukt & Grönt',
  
  // Torrvaror
  'pasta': 'Torrvaror', 'spaghetti': 'Torrvaror', 'ris': 'Torrvaror', 'sushiris': 'Torrvaror',
  'havregryn': 'Torrvaror', 'müsli': 'Torrvaror', 'granola': 'Torrvaror',
  'vetemjöl': 'Torrvaror', 'fullkornsmjöl': 'Torrvaror', 'kikärtor': 'Torrvaror',
  'linser': 'Torrvaror', 'röda linser': 'Torrvaror', 'svarta bönor': 'Torrvaror',
  'kidney bönor': 'Torrvaror', 'krossade tomater': 'Torrvaror', 'tomatpuré': 'Torrvaror',
  'quinoa': 'Torrvaror', 'chiafrön': 'Torrvaror', 'risnudlar': 'Torrvaror',
  'ramennudlar': 'Torrvaror', 'lasagneplattor': 'Torrvaror', 'tortellini': 'Torrvaror',
  'makaroner': 'Torrvaror', 'proteinpulver': 'Torrvaror', 'dadlar': 'Torrvaror',
  'russin': 'Torrvaror', 'kokos': 'Torrvaror', 'kakao': 'Torrvaror',
  'popcornmajs': 'Torrvaror', 'gula ärtor': 'Torrvaror', 'edamamebönor': 'Torrvaror',
  'edamame': 'Torrvaror', 'aprikoser torkade': 'Torrvaror',
  
  // Bröd
  'fullkornsbröd': 'Bröd', 'rågbröd': 'Bröd', 'surdegsbröd': 'Bröd',
  'ciabatta': 'Bröd', 'pitabröd': 'Bröd', 'tortillabröd': 'Bröd',
  'naanbröd': 'Bröd', 'tacoskal': 'Bröd', 'knäckebröd': 'Bröd',
  'formbröd': 'Bröd', 'vitt bröd': 'Bröd', 'rostat bröd': 'Bröd',
  'pajdeg': 'Bröd', 'krutonger': 'Bröd', 'risvåfflor': 'Bröd',
  'rårispapper': 'Bröd', 'nachos': 'Bröd', 'bröd': 'Bröd',
  
  // Kryddor & Såser
  'salt': 'Kryddor & Såser', 'svartpeppar': 'Kryddor & Såser', 'kanel': 'Kryddor & Såser',
  'curry': 'Kryddor & Såser', 'tacokrydda': 'Kryddor & Såser', 'chilipulver': 'Kryddor & Såser',
  'chili': 'Kryddor & Såser', 'chiliflingor': 'Kryddor & Såser', 'röd curry': 'Kryddor & Såser',
  'sojasås': 'Kryddor & Såser', 'honung': 'Kryddor & Såser', 'agavesirap': 'Kryddor & Såser',
  'tahini': 'Kryddor & Såser', 'pesto': 'Kryddor & Såser', 'senap': 'Kryddor & Såser',
  'majonnäs': 'Kryddor & Såser', 'salsa': 'Kryddor & Såser', 'caesardressing': 'Kryddor & Såser',
  'bearnaisesås': 'Kryddor & Såser', 'tikka masala sås': 'Kryddor & Såser',
  'lingonsylt': 'Kryddor & Såser', 'rårörd lingonsylt': 'Kryddor & Såser', 'sylt': 'Kryddor & Såser',
  'olivolja': 'Kryddor & Såser', 'dill': 'Kryddor & Såser', 'persilja': 'Kryddor & Såser',
  'basilika': 'Kryddor & Såser', 'koriander': 'Kryddor & Såser', 'rosmarin': 'Kryddor & Såser',
  'timjan': 'Kryddor & Såser', 'mynta': 'Kryddor & Såser', 'gräslök': 'Kryddor & Såser',
  'havssalt': 'Kryddor & Såser', 'grönsaksbuljong': 'Kryddor & Såser', 'bechamelsås': 'Kryddor & Såser',
  
  // Nötter (i Torrvaror eller Övrigt)
  'mandel': 'Torrvaror', 'valnötter': 'Torrvaror', 'cashewnötter': 'Torrvaror',
  'jordnötter': 'Torrvaror', 'jordnötssmör': 'Torrvaror', 'mandelsmör': 'Torrvaror',
  'nötter': 'Torrvaror', 'sesamfrön': 'Torrvaror',
};

// Hjälpfunktion för att kategorisera ingrediens
const getIngredientCategory = (ingredientName: string): IngredientCategory => {
  const lowerName = ingredientName.toLowerCase();
  
  // Direkt match
  if (ingredientCategoryMap[lowerName]) {
    return ingredientCategoryMap[lowerName];
  }
  
  // Partiell match
  for (const [key, category] of Object.entries(ingredientCategoryMap)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return category;
    }
  }
  
  return 'Övrigt';
};

// Beräkna rabattpoäng för ett recept
const calculateRecipeDiscountScore = (recipe: Recipe, stores: Store[]): number => {
  let score = 0;
  let totalDiscount = 0;
  
  recipe.ingredients.forEach(ingredient => {
    const campaign = getCampaignForIngredient(ingredient.name, stores);
    if (campaign) {
      score += 1;
      totalDiscount += campaign.discount;
    }
  });
  
  // Viktad poäng: antal rabatterade varor + total rabatt
  return score * 10 + totalDiscount;
};

interface AppState {
  userProfile: UserProfile | null;
  weeklyMealPlan: WeeklyMealPlan | null;
  shoppingList: ShoppingList | null;
  
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  generateWeeklyMealPlan: () => void;
  replaceMeal: (dayIndex: number, mealType: MealType, newRecipe: Recipe) => void;
  generateShoppingList: () => void;
  toggleShoppingItem: (store: Store, itemIndex: number) => void;
  addManualItem: (item: Omit<ShoppingItem, 'checked' | 'onSale' | 'isManuallyAdded'>) => void;
  removeManualItem: (index: number) => void;
  toggleManualItem: (index: number) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  resetApp: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  userProfile: null,
  weeklyMealPlan: null,
  shoppingList: null,

  setUserProfile: async (profile) => {
    set({ userProfile: profile });
    // Generera matsedel när profil sparas
    get().generateWeeklyMealPlan();
    await get().saveToStorage();
  },

  generateWeeklyMealPlan: () => {
    const { userProfile } = get();
    if (!userProfile) return;

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Måndag
    const days: DayPlan[] = [];

    // Filtrera recept baserat på preferenser
    const filterRecipes = (mealType: MealType): Recipe[] => {
      return recipes.filter(recipe => {
        // Rätt måltidstyp
        if (recipe.mealType !== mealType) return false;
        
        // Kolla allergier
        const hasAllergen = recipe.allergens.some(allergen => 
          userProfile.allergies.includes(allergen)
        );
        if (hasAllergen) return false;
        
        // Kolla kostpreferenser
        if (userProfile.dietaryPreferences.length > 0) {
          const matchesPreference = userProfile.dietaryPreferences.some(pref =>
            recipe.dietaryTags.includes(pref)
          );
          if (!matchesPreference) return false;
        }
        
        return true;
      });
    };

    // Sortera recept efter rabattpoäng (högst först)
    const sortByDiscountScore = (recipeList: Recipe[]): Recipe[] => {
      return [...recipeList].sort((a, b) => {
        const scoreA = calculateRecipeDiscountScore(a, userProfile.selectedStores);
        const scoreB = calculateRecipeDiscountScore(b, userProfile.selectedStores);
        return scoreB - scoreA; // Högst poäng först
      });
    };

    // Måltidsordning - frukost först
    const mealTypeOrder: MealType[] = ['frukost', 'lunch', 'middag', 'mellanmål'];
    
    // Håll koll på använda recept för att undvika upprepning
    const usedRecipeIds = new Set<string>();

    // Generera för 7 dagar
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const meals: DayMeal[] = [];

      // Lägg till måltider i rätt ordning
      mealTypeOrder.forEach(mealType => {
        // Kolla om användaren valt denna måltidstyp
        if (!userProfile.selectedMeals.includes(mealType)) return;
        
        let availableRecipes = filterRecipes(mealType);
        
        // Sortera efter rabattpoäng
        availableRecipes = sortByDiscountScore(availableRecipes);
        
        // Filtrera bort redan använda recept (för variation)
        const unusedRecipes = availableRecipes.filter(r => !usedRecipeIds.has(r.id));
        
        // Om inga oanvända finns, använd alla
        const recipesToChooseFrom = unusedRecipes.length > 0 ? unusedRecipes : availableRecipes;
        
        if (recipesToChooseFrom.length > 0) {
          // Välj ett av de topp 3 recepten (slumpmässigt bland de bästa för variation)
          const topRecipes = recipesToChooseFrom.slice(0, Math.min(3, recipesToChooseFrom.length));
          const selectedRecipe = topRecipes[Math.floor(Math.random() * topRecipes.length)];
          
          usedRecipeIds.add(selectedRecipe.id);
          
          // Beräkna portioner
          let portions = userProfile.numberOfPeople;
          
          // Extra portioner för matlådor vid lunch och middag
          if (userProfile.wantsMealPrep && (mealType === 'lunch' || mealType === 'middag')) {
            portions += userProfile.mealPrepPortions;
          }
          
          meals.push({
            mealType,
            recipe: selectedRecipe,
            portions
          });
        }
      });

      days.push({ date, meals });
    }

    const newPlan: WeeklyMealPlan = {
      weekStart,
      days
    };

    set({ weeklyMealPlan: newPlan });
    get().generateShoppingList();
  },

  replaceMeal: (dayIndex, mealType, newRecipe) => {
    const { weeklyMealPlan, userProfile } = get();
    if (!weeklyMealPlan || !userProfile) return;

    const updatedDays = [...weeklyMealPlan.days];
    const day = updatedDays[dayIndex];
    
    const mealIndex = day.meals.findIndex(m => m.mealType === mealType);
    if (mealIndex !== -1) {
      // Beräkna portioner för nya receptet
      let portions = userProfile.numberOfPeople;
      if (userProfile.wantsMealPrep && (mealType === 'lunch' || mealType === 'middag')) {
        portions += userProfile.mealPrepPortions;
      }
      
      day.meals[mealIndex] = {
        mealType,
        recipe: newRecipe,
        portions
      };
    }

    set({ weeklyMealPlan: { ...weeklyMealPlan, days: updatedDays } });
    get().generateShoppingList();
  },

  generateShoppingList: () => {
    const { weeklyMealPlan, userProfile, shoppingList: existingList } = get();
    if (!weeklyMealPlan || !userProfile) return;

    // Aggregera alla ingredienser
    const ingredientMap = new Map<string, { amount: number; unit: string; category: IngredientCategory }>();

    weeklyMealPlan.days.forEach(day => {
      day.meals.forEach(meal => {
        const multiplier = meal.portions / meal.recipe.servings;
        
        meal.recipe.ingredients.forEach(ingredient => {
          const key = `${ingredient.name}-${ingredient.unit}`;
          const existing = ingredientMap.get(key);
          const category = getIngredientCategory(ingredient.name);
          
          if (existing) {
            existing.amount += ingredient.amount * multiplier;
          } else {
            ingredientMap.set(key, {
              amount: ingredient.amount * multiplier,
              unit: ingredient.unit,
              category
            });
          }
        });
      });
    });

    // Fördela ingredienser per butik baserat på kampanjer
    const byStore: Record<Store, ShoppingItem[]> = {
      ICA: [],
      Coop: [],
      Willys: [],
      Lidl: []
    };

    ingredientMap.forEach((value, key) => {
      const [ingredientName] = key.split('-');
      
      // Hitta bästa kampanjen
      const campaign = getCampaignForIngredient(ingredientName, userProfile.selectedStores);
      
      const item: ShoppingItem = {
        ingredient: ingredientName,
        amount: Math.round(value.amount * 10) / 10, // Avrunda till 1 decimal
        unit: value.unit,
        onSale: !!campaign,
        discount: campaign?.discount,
        checked: false,
        category: value.category,
        isManuallyAdded: false
      };
      
      // Lägg till i rätt butik
      if (campaign) {
        byStore[campaign.store].push(item);
      } else {
        // Om ingen kampanj, lägg i första valda butiken
        byStore[userProfile.selectedStores[0]].push(item);
      }
    });

    // Sortera varje butiks lista efter kategori
    const categoryOrder: IngredientCategory[] = [
      'Frukt & Grönt', 'Mejeri', 'Kött & Fågel', 'Fisk & Skaldjur', 
      'Bröd', 'Torrvaror', 'Kryddor & Såser', 'Övrigt'
    ];
    
    Object.keys(byStore).forEach(store => {
      byStore[store as Store].sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.category);
        const indexB = categoryOrder.indexOf(b.category);
        return indexA - indexB;
      });
    });

    // Räkna totalt antal varor
    const totalItems = Object.values(byStore).reduce(
      (sum, items) => sum + items.length,
      0
    );

    // Behåll manuellt tillagda varor från tidigare lista
    const manualItems = existingList?.manualItems || [];

    set({
      shoppingList: {
        byStore,
        totalItems,
        manualItems
      }
    });
  },

  toggleShoppingItem: (store, itemIndex) => {
    const { shoppingList } = get();
    if (!shoppingList) return;

    const updatedByStore = { ...shoppingList.byStore };
    updatedByStore[store] = [...updatedByStore[store]];
    updatedByStore[store][itemIndex] = {
      ...updatedByStore[store][itemIndex],
      checked: !updatedByStore[store][itemIndex].checked
    };

    set({
      shoppingList: {
        ...shoppingList,
        byStore: updatedByStore
      }
    });
  },

  addManualItem: (item) => {
    const { shoppingList } = get();
    if (!shoppingList) return;

    const newItem: ShoppingItem = {
      ...item,
      checked: false,
      onSale: false,
      isManuallyAdded: true
    };

    set({
      shoppingList: {
        ...shoppingList,
        manualItems: [...shoppingList.manualItems, newItem]
      }
    });
  },

  removeManualItem: (index) => {
    const { shoppingList } = get();
    if (!shoppingList) return;

    const updatedManualItems = shoppingList.manualItems.filter((_, i) => i !== index);

    set({
      shoppingList: {
        ...shoppingList,
        manualItems: updatedManualItems
      }
    });
  },

  toggleManualItem: (index) => {
    const { shoppingList } = get();
    if (!shoppingList) return;

    const updatedManualItems = [...shoppingList.manualItems];
    updatedManualItems[index] = {
      ...updatedManualItems[index],
      checked: !updatedManualItems[index].checked
    };

    set({
      shoppingList: {
        ...shoppingList,
        manualItems: updatedManualItems
      }
    });
  },

  loadFromStorage: async () => {
    try {
      const profileJson = await AsyncStorage.getItem('userProfile');
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        set({ userProfile: profile });
        
        // Om onboarding är klar, generera matsedel
        if (profile.onboardingCompleted) {
          get().generateWeeklyMealPlan();
        }
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const { userProfile } = get();
      if (userProfile) {
        await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  },

  resetApp: async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      set({
        userProfile: null,
        weeklyMealPlan: null,
        shoppingList: null
      });
    } catch (error) {
      console.error('Failed to reset app:', error);
    }
  }
}));
