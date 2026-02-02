// Type definitions for the app

export type DietaryPreference = 'vegetariskt' | 'veganskt' | 'barnvänlig' | 'keto' | 'proteinrik';
export type Allergen = 'nöt' | 'ägg' | 'laktos' | 'mjölkprotein' | 'gluten';
export type MealType = 'frukost' | 'lunch' | 'middag' | 'mellanmål';
export type Store = 'ICA' | 'Coop' | 'Willys' | 'Lidl';

// Specific store names
export type SpecificStore = 
  | 'ICA Maxi Umeå'
  | 'ICA Kvantum Ersboda'
  | 'ICA Nära Bygdeå'
  | 'ICA Maxi Skellefteå'
  | 'ICA Maxi Lycksele'
  | 'Coop Forum Umeå'
  | 'Coop Bygdeå'
  | 'Coop Forum Skellefteå'
  | 'Coop Lycksele'
  | 'Willys Vasaplan'
  | 'Willys Skellefteå'
  | 'Willys Lycksele';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  mealType: MealType;
  dietaryTags: DietaryPreference[];
  allergens: Allergen[];
  ingredients: Ingredient[];
  servings: number;
  prepTime: number;
  cookTime: number;
  instructions: string[];
  imageColor: string; // For illustration placeholder
}

export interface Campaign {
  store: Store;
  ingredient: string;
  discount: number;
  validUntil: Date;
}

export interface UserProfile {
  numberOfPeople: number;
  dietaryPreferences: DietaryPreference[];
  allergies: Allergen[];
  location: string;
  selectedMeals: MealType[];
  selectedStores: Store[];
  wantsMealPrep: boolean; // matlådor
  mealPrepPortions: number; // extra portioner för matlådor
  onboardingCompleted: boolean;
}

export interface DayMeal {
  mealType: MealType;
  recipe: Recipe;
  portions: number;
}

export interface DayPlan {
  date: Date;
  meals: DayMeal[];
}

export interface WeeklyMealPlan {
  weekStart: Date;
  days: DayPlan[];
}

export interface ShoppingItem {
  ingredient: string;
  amount: number;
  unit: string;
  onSale: boolean;
  discount?: number;
  checked: boolean;
}

export interface ShoppingList {
  byStore: Record<Store, ShoppingItem[]>;
  totalItems: number;
}