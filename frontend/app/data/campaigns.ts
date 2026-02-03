import { Campaign, Store } from '../types';

// Vecka 6: 2-8 februari 2025 (denna vecka)
const week6Start = new Date('2025-02-02');
const week6End = new Date('2025-02-08');

// Vecka 7: 9-15 februari 2025
const week7Start = new Date('2025-02-09');
const week7End = new Date('2025-02-15');

// Vecka 8: 16-22 februari 2025
const week8Start = new Date('2025-02-16');
const week8End = new Date('2025-02-22');

export const campaigns: Campaign[] = [
  // ==================== VECKA 6 (2-8 februari 2025) ====================
  
  // ICA Supermarket - Vecka 6 (RIKTIGA erbjudanden)
  { store: 'ICA', ingredient: 'Cheddar', discount: 35, validUntil: week6End },       // Riven Cheddar & Mozzarella 20 kr
  { store: 'ICA', ingredient: 'Mozzarella', discount: 35, validUntil: week6End },    // Riven Cheddar & Mozzarella 20 kr
  { store: 'ICA', ingredient: 'Tomat', discount: 30, validUntil: week6End },         // Tomater 25 kr/pk
  { store: 'ICA', ingredient: 'Päron', discount: 40, validUntil: week6End },         // Päron 15 kr/kg
  { store: 'ICA', ingredient: 'Havredryck', discount: 30, validUntil: week6End },    // Oatly iKaffe 2 för 30 kr
  { store: 'ICA', ingredient: 'Mango', discount: 35, validUntil: week6End },         // Mogen mango 2 för 25 kr
  { store: 'ICA', ingredient: 'Ärtor', discount: 25, validUntil: week6End },         // Ärtor majs & paprika 2 för 40 kr

  // Coop - Vecka 6 (RIKTIGA erbjudanden)
  { store: 'Coop', ingredient: 'Yoghurt', discount: 35, validUntil: week6End },      // Arla Yoghurt 2 för 35 kr
  { store: 'Coop', ingredient: 'Apelsin', discount: 40, validUntil: week6End },      // Apelsiner 17 kr/kg
  { store: 'Coop', ingredient: 'Bacon', discount: 30, validUntil: week6End },        // Scan Baconskivor 39,90 kr
  { store: 'Coop', ingredient: 'Knäckebröd', discount: 25, validUntil: week6End },   // Sport Knäckebröd 2 för 39 kr
  { store: 'Coop', ingredient: 'Bröd', discount: 25, validUntil: week6End },         // Skogaholmslimpa 22,90 kr
  { store: 'Coop', ingredient: 'Havredryck', discount: 30, validUntil: week6End },   // Oatly iKaffe 2 för 35 kr

  // Willys - Vecka 6 (RIKTIGA erbjudanden)
  { store: 'Willys', ingredient: 'Ost', discount: 30, validUntil: week6End },        // Gouda Familjefavoriter 79,90 kr/kg
  { store: 'Willys', ingredient: 'Falukorv', discount: 45, validUntil: week6End },   // Falukorv 19,90 kr (ord 35,90)
  { store: 'Willys', ingredient: 'Högrev', discount: 30, validUntil: week6End },     // Högrev Nötkött 118 kr/kg
  { store: 'Willys', ingredient: 'Nötfärs', discount: 30, validUntil: week6End },    // Högrev Nötkött
  { store: 'Willys', ingredient: 'Vitkål', discount: 60, validUntil: week6End },     // Vitkål 4,90 kr/kg (ord 12,90)
  { store: 'Willys', ingredient: 'Kål', discount: 60, validUntil: week6End },        // Vitkål
  { store: 'Willys', ingredient: 'Kokosgrädde', discount: 30, validUntil: week6End }, // Kokosgrädde 2 för 24 kr
  { store: 'Willys', ingredient: 'Kokosmjölk', discount: 30, validUntil: week6End }, // Kokosgrädde
  { store: 'Willys', ingredient: 'Vårrullar', discount: 40, validUntil: week6End },  // Daloon Vårrullar 29,90 kr
  { store: 'Willys', ingredient: 'Risnudlar', discount: 25, validUntil: week6End },  // Rice Noodles 17,90 kr
  { store: 'Willys', ingredient: 'Blåbär', discount: 25, validUntil: week6End },     // Proviva Blåbär 24,90 kr

  // Lidl - Vecka 6 (RIKTIGA erbjudanden från reklamblad 2/2-8/2)
  // Frukt & Grönt
  { store: 'Lidl', ingredient: 'Lök', discount: 50, validUntil: week6End },           // Gul lök 5,90 kr/kg - Superpris
  { store: 'Lidl', ingredient: 'Ananas', discount: 40, validUntil: week6End },        // 16,90 kr med Lidl Plus
  { store: 'Lidl', ingredient: 'Päron', discount: 35, validUntil: week6End },         // 17,90 kr/kg
  { store: 'Lidl', ingredient: 'Jordgubbar', discount: 30, validUntil: week6End },    // 39,90 kr / 400g
  { store: 'Lidl', ingredient: 'Vitlök', discount: 25, validUntil: week6End },        // 19,90 kr / 250g
  { store: 'Lidl', ingredient: 'Spenat', discount: 30, validUntil: week6End },        // 24,90 kr / 500g
  { store: 'Lidl', ingredient: 'Selleri', discount: 35, validUntil: week6End },       // Stjälkselleri 11,90 kr/kg
  
  // Kött & Fisk
  { store: 'Lidl', ingredient: 'Kycklinglårfilé', discount: 30, validUntil: week6End },  // 119 kr/kg
  { store: 'Lidl', ingredient: 'Kycklingfilé', discount: 35, validUntil: week6End },     // Marinerad 99 kr
  { store: 'Lidl', ingredient: 'Kyckling', discount: 30, validUntil: week6End },         // Minutstrimlor 69,90 kr
  { store: 'Lidl', ingredient: 'Lax', discount: 25, validUntil: week6End },              // Kallrökt/gravad 109 kr
  { store: 'Lidl', ingredient: 'Biff', discount: 20, validUntil: week6End },             // Pepperbiff 179 kr/kg
  { store: 'Lidl', ingredient: 'Pulled pork', discount: 30, validUntil: week6End },      // 49,90 kr
  { store: 'Lidl', ingredient: 'Fläsk', discount: 40, validUntil: week6End },            // Skinkgrytbitar 39,90 kr

  // ==================== VECKA 7 (10-16 februari 2025) ====================
  // ICA - Vecka 7
  { store: 'ICA', ingredient: 'Torsk', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Bacon', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Grädde', discount: 25, validUntil: week7End },
  { store: 'ICA', ingredient: 'Paprika', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Avokado', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Fullkornsbröd', discount: 25, validUntil: week7End },
  { store: 'ICA', ingredient: 'Hallon', discount: 40, validUntil: week7End },
  { store: 'ICA', ingredient: 'Spaghetti', discount: 20, validUntil: week7End },
  { store: 'ICA', ingredient: 'Kesella', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Grekisk yoghurt', discount: 25, validUntil: week7End },

  // Coop - Vecka 7
  { store: 'Coop', ingredient: 'Kycklingfilé', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Champinjoner', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Lök', discount: 25, validUntil: week7End },
  { store: 'Coop', ingredient: 'Morot', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Sallad', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Tortillabröd', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Fetaost', discount: 25, validUntil: week7End },
  { store: 'Coop', ingredient: 'Ägg', discount: 30, validUntil: week7End },

  // Willys - Vecka 7
  { store: 'Willys', ingredient: 'Lax', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Potatis', discount: 25, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pasta', discount: 20, validUntil: week7End },
  { store: 'Willys', ingredient: 'Mjölk', discount: 20, validUntil: week7End },
  { store: 'Willys', ingredient: 'Havregryn', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Lingonsylt', discount: 25, validUntil: week7End },

  // ==================== VECKA 8 (17-23 februari 2025) ====================
  // ICA - Vecka 8
  { store: 'ICA', ingredient: 'Nötfärs', discount: 35, validUntil: week8End },
  { store: 'ICA', ingredient: 'Räkor', discount: 40, validUntil: week8End },
  { store: 'ICA', ingredient: 'Lök', discount: 25, validUntil: week8End },
  { store: 'ICA', ingredient: 'Champinjoner', discount: 30, validUntil: week8End },
  { store: 'ICA', ingredient: 'Ris', discount: 25, validUntil: week8End },
  { store: 'ICA', ingredient: 'Mozzarella', discount: 30, validUntil: week8End },
  { store: 'ICA', ingredient: 'Kiwi', discount: 35, validUntil: week8End },

  // Coop - Vecka 8
  { store: 'Coop', ingredient: 'Fläskfilé', discount: 30, validUntil: week8End },
  { store: 'Coop', ingredient: 'Broccoli', discount: 30, validUntil: week8End },
  { store: 'Coop', ingredient: 'Pasta', discount: 20, validUntil: week8End },
  { store: 'Coop', ingredient: 'Smör', discount: 25, validUntil: week8End },

  // Willys - Vecka 8
  { store: 'Willys', ingredient: 'Torsk', discount: 35, validUntil: week8End },
  { store: 'Willys', ingredient: 'Tomat', discount: 35, validUntil: week8End },
  { store: 'Willys', ingredient: 'Gurka', discount: 25, validUntil: week8End },
  { store: 'Willys', ingredient: 'Yoghurt', discount: 25, validUntil: week8End },
];

// Hjälpfunktion för att hitta kampanjer för specifik ingrediens
export const getCampaignForIngredient = (ingredient: string, stores: Store[]): Campaign | null => {
  const now = new Date();
  
  // Hitta bästa kampanjen (högsta rabatten) för den specifika ingrediensen bland valda butiker
  // och som fortfarande är giltig
  const relevantCampaigns = campaigns.filter(
    c => stores.includes(c.store) && 
    c.validUntil >= now &&
    (ingredient.toLowerCase().includes(c.ingredient.toLowerCase()) ||
    c.ingredient.toLowerCase().includes(ingredient.toLowerCase()))
  );
  
  if (relevantCampaigns.length === 0) return null;
  
  // Returnera kampanjen med högst rabatt
  return relevantCampaigns.reduce((best, current) => 
    current.discount > best.discount ? current : best
  );
};

// Hjälpfunktion för att få alla giltiga kampanjer för en viss vecka
export const getCampaignsForWeek = (weekOffset: number = 0): Campaign[] => {
  const now = new Date();
  const weekStart = new Date(now.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return campaigns.filter(c => 
    c.validUntil >= weekStart && c.validUntil < weekEnd
  );
};
