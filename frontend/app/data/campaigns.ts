import { Campaign, Store } from '../types';

// Vecka 6: 3-9 februari 2025 (denna vecka)
const week6Start = new Date('2025-02-03');
const week6End = new Date('2025-02-09');

// Vecka 7: 10-16 februari 2025
const week7Start = new Date('2025-02-10');
const week7End = new Date('2025-02-16');

// Vecka 8: 17-23 februari 2025
const week8Start = new Date('2025-02-17');
const week8End = new Date('2025-02-23');

export const campaigns: Campaign[] = [
  // ==================== VECKA 6 (3-9 februari 2025) ====================
  // ICA - Vecka 6
  { store: 'ICA', ingredient: 'Kycklingfilé', discount: 35, validUntil: week6End },
  { store: 'ICA', ingredient: 'Falukorv', discount: 25, validUntil: week6End },
  { store: 'ICA', ingredient: 'Mjölk', discount: 20, validUntil: week6End },
  { store: 'ICA', ingredient: 'Ägg', discount: 30, validUntil: week6End },
  { store: 'ICA', ingredient: 'Banan', discount: 20, validUntil: week6End },
  { store: 'ICA', ingredient: 'Tomat', discount: 35, validUntil: week6End },
  { store: 'ICA', ingredient: 'Havregryn', discount: 25, validUntil: week6End },
  { store: 'ICA', ingredient: 'Pasta', discount: 20, validUntil: week6End },
  { store: 'ICA', ingredient: 'Färskpotatis', discount: 30, validUntil: week6End },
  { store: 'ICA', ingredient: 'Yoghurt', discount: 25, validUntil: week6End },
  { store: 'ICA', ingredient: 'Smör', discount: 20, validUntil: week6End },
  { store: 'ICA', ingredient: 'Apelsin', discount: 30, validUntil: week6End },

  // Coop - Vecka 6
  { store: 'Coop', ingredient: 'Nötfärs', discount: 40, validUntil: week6End },
  { store: 'Coop', ingredient: 'Lax', discount: 35, validUntil: week6End },
  { store: 'Coop', ingredient: 'Potatis', discount: 25, validUntil: week6End },
  { store: 'Coop', ingredient: 'Broccoli', discount: 30, validUntil: week6End },
  { store: 'Coop', ingredient: 'Gurka', discount: 25, validUntil: week6End },
  { store: 'Coop', ingredient: 'Ost', discount: 30, validUntil: week6End },
  { store: 'Coop', ingredient: 'Kikärtor', discount: 35, validUntil: week6End },
  { store: 'Coop', ingredient: 'Paprika', discount: 30, validUntil: week6End },
  { store: 'Coop', ingredient: 'Kokosmjölk', discount: 25, validUntil: week6End },
  { store: 'Coop', ingredient: 'Avokado', discount: 35, validUntil: week6End },

  // Willys - Vecka 6
  { store: 'Willys', ingredient: 'Fläskfilé', discount: 35, validUntil: week6End },
  { store: 'Willys', ingredient: 'Räkor', discount: 30, validUntil: week6End },
  { store: 'Willys', ingredient: 'Ris', discount: 25, validUntil: week6End },
  { store: 'Willys', ingredient: 'Krossade tomater', discount: 30, validUntil: week6End },
  { store: 'Willys', ingredient: 'Blåbär', discount: 40, validUntil: week6End },
  { store: 'Willys', ingredient: 'Jordgubbar', discount: 35, validUntil: week6End },
  { store: 'Willys', ingredient: 'Filmjölk', discount: 20, validUntil: week6End },
  { store: 'Willys', ingredient: 'Bacon', discount: 30, validUntil: week6End },
  { store: 'Willys', ingredient: 'Grädde', discount: 25, validUntil: week6End },
  { store: 'Willys', ingredient: 'Spaghetti', discount: 20, validUntil: week6End },

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
