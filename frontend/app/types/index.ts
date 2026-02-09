// Type definitions for the app

// Utökade kostpreferenser (flerval)
export type DietaryPreference = 
  | 'allatare' 
  | 'pescetariansk' 
  | 'flexitariansk'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'lchf';

// Utökade allergier
export type Allergen = 
  | 'gluten' 
  | 'laktos' 
  | 'mjolkprotein' 
  | 'agg' 
  | 'notter' 
  | 'soja' 
  | 'fisk' 
  | 'skaldjur' 
  | 'sesam';

// Måltidstyper
export type MealType = 'frukost' | 'lunch' | 'middag' | 'mellanmal';

export type Store = 'ICA' | 'Coop' | 'Willys' | 'Lidl';

export interface Campaign {
  store: Store;
  ingredient: string;
  originalPrice?: number;
  campaignPrice: number;
  discount: number;
  unit?: string;
  validUntil: Date;
  category: IngredientCategory;
  // Allergener som produkten innehåller
  allergens?: Allergen[];
  // Om produkten är vegetarisk/pescetariansk
  isVegetarian?: boolean;
  isFish?: boolean;
  isMeat?: boolean;
}

export interface UserProfile {
  numberOfPeople: number;
  dietaryPreferences: DietaryPreference[]; // Flerval
  allergies: Allergen[];
  location: string;
  selectedStores: Store[];
  // Nya fält
  selectedMeals: MealType[]; // Vilka måltider per dag
  lunchboxCount: number; // Antal matlådor (0 = ingen)
  wantsBatchCooking: boolean; // Preppa/batch-laga
  onboardingCompleted: boolean;
}

// Kategorier för inköpslistan
export type IngredientCategory = 
  | 'Mejeri'
  | 'Kött & Fågel'
  | 'Fisk & Skaldjur'
  | 'Frukt & Grönt'
  | 'Torrvaror'
  | 'Bröd'
  | 'Kryddor & Såser'
  | 'Drycker'
  | 'Övrigt';

export interface ShoppingItem {
  id: string;
  ingredient: string;
  amount: number;
  unit: string;
  onSale: boolean;
  discount?: number;
  price?: number;
  originalPrice?: number;
  checked: boolean;
  category: IngredientCategory;
  store?: Store;
  isManuallyAdded?: boolean;
}

export interface ShoppingList {
  byStore: Record<Store, ShoppingItem[]>;
  totalItems: number;
  manualItems: ShoppingItem[];
}

// Förslag baserat på kampanjer
export interface CampaignSuggestion {
  id: string;
  title: string;
  description: string;
  ingredients: Campaign[];
  totalSavings: number;
  category: IngredientCategory;
  matchesPreferences: boolean;
}

export interface WeeklySuggestions {
  weekStart: Date;
  suggestions: CampaignSuggestion[];
  totalPotentialSavings: number;
}
