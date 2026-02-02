import { Campaign, Store } from '../types';

// Realistiska veckokampanjer - flera veckor framåt
// Vecka 1 (Denna vecka)
const week1Start = new Date();
const week1End = new Date(week1Start.getTime() + 7 * 24 * 60 * 60 * 1000);

// Vecka 2 (Nästa vecka)
const week2Start = week1End;
const week2End = new Date(week2Start.getTime() + 7 * 24 * 60 * 60 * 1000);

// Vecka 3
const week3Start = week2End;
const week3End = new Date(week3Start.getTime() + 7 * 24 * 60 * 60 * 1000);

export const campaigns: Campaign[] = [
  // ==================== VECKA 1 (Denna vecka) ====================
  // ICA Umeå - Vecka 1
  { store: 'ICA', ingredient: 'Kycklingfilé', discount: 30, validUntil: week1End },
  { store: 'ICA', ingredient: 'Lax', discount: 25, validUntil: week1End },
  { store: 'ICA', ingredient: 'Mjölk', discount: 15, validUntil: week1End },
  { store: 'ICA', ingredient: 'Ägg', discount: 20, validUntil: week1End },
  { store: 'ICA', ingredient: 'Banan', discount: 25, validUntil: week1End },
  { store: 'ICA', ingredient: 'Tomat', discount: 30, validUntil: week1End },
  { store: 'ICA', ingredient: 'Havregryn', discount: 20, validUntil: week1End },
  { store: 'ICA', ingredient: 'Pasta', discount: 15, validUntil: week1End },
  { store: 'ICA', ingredient: 'Bröd', discount: 25, validUntil: week1End },
  { store: 'ICA', ingredient: 'Yoghurt', discount: 20, validUntil: week1End },

  // Coop Umeå - Vecka 1
  { store: 'Coop', ingredient: 'Nötfärs', discount: 35, validUntil: week1End },
  { store: 'Coop', ingredient: 'Potatis', discount: 20, validUntil: week1End },
  { store: 'Coop', ingredient: 'Broccoli', discount: 30, validUntil: week1End },
  { store: 'Coop', ingredient: 'Gurka', discount: 25, validUntil: week1End },
  { store: 'Coop', ingredient: 'Ost', discount: 20, validUntil: week1End },
  { store: 'Coop', ingredient: 'Smör', discount: 15, validUntil: week1End },
  { store: 'Coop', ingredient: 'Kikärtor', discount: 30, validUntil: week1End },
  { store: 'Coop', ingredient: 'Vitlök', discount: 25, validUntil: week1End },

  // Willys Umeå - Vecka 1
  { store: 'Willys', ingredient: 'Fläskfilé', discount: 30, validUntil: week1End },
  { store: 'Willys', ingredient: 'Räkor', discount: 25, validUntil: week1End },
  { store: 'Willys', ingredient: 'Ris', discount: 20, validUntil: week1End },
  { store: 'Willys', ingredient: 'Krossade tomater', discount: 25, validUntil: week1End },
  { store: 'Willys', ingredient: 'Blåbär', discount: 35, validUntil: week1End },
  { store: 'Willys', ingredient: 'Jordgubbar', discount: 30, validUntil: week1End },
  { store: 'Willys', ingredient: 'Filmjölk', discount: 15, validUntil: week1End },

  // ==================== VECKA 2 (Nästa vecka) ====================
  // ICA Umeå - Vecka 2
  { store: 'ICA', ingredient: 'Torsk', discount: 30, validUntil: week2End },
  { store: 'ICA', ingredient: 'Bacon', discount: 25, validUntil: week2End },
  { store: 'ICA', ingredient: 'Grädde', discount: 20, validUntil: week2End },
  { store: 'ICA', ingredient: 'Paprika', discount: 30, validUntil: week2End },
  { store: 'ICA', ingredient: 'Avokado', discount: 25, validUntil: week2End },
  { store: 'ICA', ingredient: 'Fullkornsbröd', discount: 20, validUntil: week2End },
  { store: 'ICA', ingredient: 'Hallon', discount: 35, validUntil: week2End },
  { store: 'ICA', ingredient: 'Spaghetti', discount: 15, validUntil: week2End },
  { store: 'ICA', ingredient: 'Kesella', discount: 25, validUntil: week2End },
  { store: 'ICA', ingredient: 'Grekisk yoghurt', discount: 20, validUntil: week2End },

  // Coop Umeå - Vecka 2
  { store: 'Coop', ingredient: 'Lax', discount: 30, validUntil: week2End },
  { store: 'Coop', ingredient: 'Champinjoner', discount: 25, validUntil: week2End },
  { store: 'Coop', ingredient: 'Lök', discount: 20, validUntil: week2End },
  { store: 'Coop', ingredient: 'Morot', discount: 25, validUntil: week2End },
  { store: 'Coop', ingredient: 'Sallad', discount: 30, validUntil: week2End },
  { store: 'Coop', ingredient: 'Kokosmjölk', discount: 20, validUntil: week2End },
  { store: 'Coop', ingredient: 'Tortillabröd', discount: 25, validUntil: week2End },
  { store: 'Coop', ingredient: 'Fetaost', discount: 20, validUntil: week2End },

  // Willys Umeå - Vecka 2
  { store: 'Willys', ingredient: 'Kycklingfilé', discount: 35, validUntil: week2End },
  { store: 'Willys', ingredient: 'Potatis', discount: 20, validUntil: week2End },
  { store: 'Willys', ingredient: 'Pasta', discount: 15, validUntil: week2End },
  { store: 'Willys', ingredient: 'Ägg', discount: 25, validUntil: week2End },
  { store: 'Willys', ingredient: 'Havregryn', discount: 30, validUntil: week2End },
  { store: 'Willys', ingredient: 'Lingonsylt', discount: 20, validUntil: week2End },
  { store: 'Willys', ingredient: 'Mjölk', discount: 15, validUntil: week2End },

  // ==================== VECKA 3 ====================
  // ICA Umeå - Vecka 3
  { store: 'ICA', ingredient: 'Nötfärs', discount: 30, validUntil: week3End },
  { store: 'ICA', ingredient: 'Räkor', discount: 35, validUntil: week3End },
  { store: 'ICA', ingredient: 'Lök', discount: 20, validUntil: week3End },
  { store: 'ICA', ingredient: 'Champinjoner', discount: 25, validUntil: week3End },
  { store: 'ICA', ingredient: 'Ris', discount: 20, validUntil: week3End },
  { store: 'ICA', ingredient: 'Mozzarella', discount: 25, validUntil: week3End },
  { store: 'ICA', ingredient: 'Kiwi', discount: 30, validUntil: week3End },
  { store: 'ICA', ingredient: 'Banan', discount: 20, validUntil: week3End },

  // Coop Umeå - Vecka 3
  { store: 'Coop', ingredient: 'Kycklingfilé', discount: 30, validUntil: week3End },
  { store: 'Coop', ingredient: 'Fläskfilé', discount: 25, validUntil: week3End },
  { store: 'Coop', ingredient: 'Paprika', discount: 30, validUntil: week3End },
  { store: 'Coop', ingredient: 'Broccoli', discount: 25, validUntil: week3End },
  { store: 'Coop', ingredient: 'Pasta', discount: 15, validUntil: week3End },
  { store: 'Coop', ingredient: 'Ost', discount: 20, validUntil: week3End },
  { store: 'Coop', ingredient: 'Avokado', discount: 30, validUntil: week3End },

  // Willys Umeå - Vecka 3
  { store: 'Willys', ingredient: 'Torsk', discount: 30, validUntil: week3End },
  { store: 'Willys', ingredient: 'Bacon', discount: 25, validUntil: week3End },
  { store: 'Willys', ingredient: 'Tomat', discount: 30, validUntil: week3End },
  { store: 'Willys', ingredient: 'Gurka', discount: 20, validUntil: week3End },
  { store: 'Willys', ingredient: 'Yoghurt', discount: 20, validUntil: week3End },
  { store: 'Willys', ingredient: 'Krossade tomater', discount: 25, validUntil: week3End },
];

// Hjälpfunktion för att hitta kampanjer för specifik ingrediens
export const getCampaignForIngredient = (ingredient: string, stores: Store[]): Campaign | null => {
  const now = new Date();
  
  // Hitta bästa kampanjen (högsta rabatten) för den specifika ingrediensen bland valda butiker
  // och som fortfarande är giltig
  const relevantCampaigns = campaigns.filter(
    c => stores.includes(c.store) && 
    c.validUntil > now &&
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
    c.validUntil > weekStart && c.validUntil <= weekEnd
  );
};
