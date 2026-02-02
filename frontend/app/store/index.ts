import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WeeklyMealPlan, ShoppingList, Recipe, DayMeal, DayPlan, Store, MealType } from '../types';
import { recipes } from '../data/recipes';
import { campaigns, getCampaignForIngredient } from '../data/campaigns';
import { startOfWeek, addDays } from 'date-fns';

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
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
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

    // Måltidsordning - frukost först
    const mealTypeOrder: MealType[] = ['frukost', 'lunch', 'middag', 'mellanmål'];

    // Generera för 7 dagar
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const meals: DayMeal[] = [];

      // Lägg till måltider i rätt ordning
      mealTypeOrder.forEach(mealType => {
        // Kolla om användaren valt denna måltidstyp
        if (!userProfile.selectedMeals.includes(mealType)) return;
        
        const availableRecipes = filterRecipes(mealType);
        if (availableRecipes.length > 0) {
          // Välj slumpmässigt recept
          const randomRecipe = availableRecipes[
            Math.floor(Math.random() * availableRecipes.length)
          ];
          
          // Beräkna portioner
          let portions = userProfile.numberOfPeople;
          
          // Extra portioner för matlådor vid lunch och middag
          if (userProfile.wantsMealPrep && (mealType === 'lunch' || mealType === 'middag')) {
            portions += userProfile.mealPrepPortions;
          }
          
          meals.push({
            mealType,
            recipe: randomRecipe,
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
    const { weeklyMealPlan, userProfile } = get();
    if (!weeklyMealPlan || !userProfile) return;

    // Aggregera alla ingredienser
    const ingredientMap = new Map<string, { amount: number; unit: string }>();

    weeklyMealPlan.days.forEach(day => {
      day.meals.forEach(meal => {
        const multiplier = meal.portions / meal.recipe.servings;
        
        meal.recipe.ingredients.forEach(ingredient => {
          const key = `${ingredient.name}-${ingredient.unit}`;
          const existing = ingredientMap.get(key);
          
          if (existing) {
            existing.amount += ingredient.amount * multiplier;
          } else {
            ingredientMap.set(key, {
              amount: ingredient.amount * multiplier,
              unit: ingredient.unit
            });
          }
        });
      });
    });

    // Fördela ingredienser per butik baserat på kampanjer
    const byStore: Record<Store, any[]> = {
      ICA: [],
      Coop: [],
      Willys: []
    };

    ingredientMap.forEach((value, key) => {
      const [ingredientName] = key.split('-');
      
      // Hitta bästa kampanjen
      const campaign = getCampaignForIngredient(ingredientName, userProfile.selectedStores);
      
      const item = {
        ingredient: ingredientName,
        amount: Math.round(value.amount * 10) / 10, // Avrunda till 1 decimal
        unit: value.unit,
        onSale: !!campaign,
        discount: campaign?.discount,
        checked: false
      };
      
      // Lägg till i rätt butik
      if (campaign) {
        byStore[campaign.store].push(item);
      } else {
        // Om ingen kampanj, lägg i första valda butiken
        byStore[userProfile.selectedStores[0]].push(item);
      }
    });

    // Räkna totalt antal varor
    const totalItems = Object.values(byStore).reduce(
      (sum, items) => sum + items.length,
      0
    );

    set({
      shoppingList: {
        byStore,
        totalItems
      }
    });
  },

  toggleShoppingItem: (store, itemIndex) => {
    const { shoppingList } = get();
    if (!shoppingList) return;

    const updatedByStore = { ...shoppingList.byStore };
    updatedByStore[store][itemIndex].checked = !updatedByStore[store][itemIndex].checked;

    set({
      shoppingList: {
        ...shoppingList,
        byStore: updatedByStore
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
  }
}));