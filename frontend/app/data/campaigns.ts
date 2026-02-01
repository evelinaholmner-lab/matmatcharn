import { Campaign, Store } from '../types';

// Mockad kampanjdata för ICA, Coop och Willys
const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

export const campaigns: Campaign[] = [
  // ICA kampanjer
  { store: 'ICA', ingredient: 'Lax', discount: 30, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Kycklingfilé', discount: 25, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Potatis', discount: 20, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Mjölk', discount: 15, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Ägg', discount: 20, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Havregryn', discount: 25, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Yoghurt', discount: 20, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Tomat', discount: 30, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Paprika', discount: 25, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Bacon', discount: 20, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Pasta', discount: 15, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Ris', discount: 20, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Grädde', discount: 15, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Bröd', discount: 25, validUntil: nextWeek },
  { store: 'ICA', ingredient: 'Avokado', discount: 30, validUntil: nextWeek },
  
  // Coop kampanjer
  { store: 'Coop', ingredient: 'Nötfärs', discount: 30, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Lax', discount: 25, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Broccoli', discount: 35, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Gurka', discount: 20, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Sallad', discount: 25, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Ost', discount: 20, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Smör', discount: 15, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Kokosmjölk', discount: 25, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Kikärtor', discount: 30, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Champinjoner', discount: 25, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Vitlök', discount: 20, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Lök', discount: 15, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Morot', discount: 20, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Tortillabröd', discount: 25, validUntil: nextWeek },
  { store: 'Coop', ingredient: 'Banan', discount: 20, validUntil: nextWeek },
  
  // Willys kampanjer
  { store: 'Willys', ingredient: 'Kycklingfilé', discount: 35, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Fläskfilé', discount: 30, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Potatis', discount: 25, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Räkor', discount: 20, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Torsk', discount: 25, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Ägg', discount: 25, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Filmjölk', discount: 20, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Ris', discount: 25, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Pasta', discount: 20, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Krossade tomater', discount: 30, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Spaghetti', discount: 25, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Havregryn', discount: 30, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Blåbär', discount: 35, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Jordgubbar', discount: 30, validUntil: nextWeek },
  { store: 'Willys', ingredient: 'Lingonsylt', discount: 20, validUntil: nextWeek },
];

// Hjälpfunktion för att hitta kampanjer för specifik ingrediens
export const getCampaignForIngredient = (ingredient: string, stores: Store[]): Campaign | null => {
  // Hitta bästa kampanjen (högsta rabatten) för den specifika ingrediensen bland valda butiker
  const relevantCampaigns = campaigns.filter(
    c => stores.includes(c.store) && 
    ingredient.toLowerCase().includes(c.ingredient.toLowerCase()) ||
    c.ingredient.toLowerCase().includes(ingredient.toLowerCase())
  );
  
  if (relevantCampaigns.length === 0) return null;
  
  // Returnera kampanjen med högst rabatt
  return relevantCampaigns.reduce((best, current) => 
    current.discount > best.discount ? current : best
  );
};
