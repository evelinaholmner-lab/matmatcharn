import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, ShoppingList, Store, ShoppingItem, IngredientCategory, Allergen, DietaryPreference } from '../types';
import { campaigns, getCurrentWeekCampaigns } from '../data/campaigns';

// Hjälpfunktion för att kategorisera ingrediens
const getIngredientCategory = (ingredientName: string): IngredientCategory => {
  const lowerName = ingredientName.toLowerCase();
  
  // Mejeri
  if (['mjölk', 'grädde', 'smör', 'ost', 'yoghurt', 'filmjölk', 'kvarg', 'cheddar', 'mozzarella', 'parmesan', 
       'oatly', 'havredryck', 'ägg', 'cream cheese'].some(k => lowerName.includes(k))) {
    return 'Mejeri';
  }
  // Kött & Fågel
  if (['kyckling', 'nötfärs', 'fläsk', 'bacon', 'korv', 'falukorv', 'skinka', 'högrev', 'pulled pork', 
       'köttfärs', 'lammracks', 'kalv'].some(k => lowerName.includes(k))) {
    return 'Kött & Fågel';
  }
  // Fisk & Skaldjur
  if (['lax', 'torsk', 'räkor', 'fisk', 'sill', 'tonfisk', 'sej'].some(k => lowerName.includes(k))) {
    return 'Fisk & Skaldjur';
  }
  // Frukt & Grönt
  if (['tomat', 'gurka', 'lök', 'vitlök', 'morot', 'potatis', 'sallad', 'spenat', 'paprika', 'broccoli',
       'äpple', 'päron', 'banan', 'mango', 'ananas', 'jordgubb', 'blåbär', 'apelsin', 'vitkål', 'selleri'].some(k => lowerName.includes(k))) {
    return 'Frukt & Grönt';
  }
  // Bröd
  if (['bröd', 'knäckebröd', 'limpa', 'tortilla', 'pita', 'naan'].some(k => lowerName.includes(k))) {
    return 'Bröd';
  }
  // Torrvaror
  if (['pasta', 'ris', 'nudlar', 'havregryn', 'müsli', 'mjöl', 'linser', 'bönor', 'kikärtor', 'vårrullar'].some(k => lowerName.includes(k))) {
    return 'Torrvaror';
  }
  // Drycker
  if (['pepsi', 'cola', 'juice', 'läsk', 'vatten', 'must'].some(k => lowerName.includes(k))) {
    return 'Drycker';
  }
  
  return 'Övrigt';
};

// Kontrollera om en produkt matchar användarens preferenser
const matchesPreferences = (
  campaign: any,
  dietaryPreferences: DietaryPreference[],
  allergies: Allergen[]
): boolean => {
  const name = campaign.ingredient.toLowerCase();
  
  // Kolla allergier
  if (allergies.includes('gluten') && ['pasta', 'bröd', 'nudlar', 'mjöl', 'knäckebröd'].some(k => name.includes(k))) {
    return false;
  }
  if (allergies.includes('laktos') && ['mjölk', 'grädde', 'yoghurt', 'ost', 'smör'].some(k => name.includes(k))) {
    return false;
  }
  if (allergies.includes('mjolkprotein') && ['mjölk', 'ost', 'grädde', 'yoghurt', 'smör', 'cream'].some(k => name.includes(k))) {
    return false;
  }
  if (allergies.includes('agg') && ['ägg'].some(k => name.includes(k))) {
    return false;
  }
  if (allergies.includes('notter') && ['nöt', 'mandel', 'cashew', 'jordnöt'].some(k => name.includes(k))) {
    return false;
  }
  if (allergies.includes('soja') && ['soja', 'tofu', 'edamame'].some(k => name.includes(k))) {
    return false;
  }
  if (allergies.includes('fisk') && ['lax', 'torsk', 'sill', 'fisk', 'sej', 'tonfisk'].some(k => name.includes(k))) {
    return false;
  }
  if (allergies.includes('skaldjur') && ['räkor', 'räk', 'krabba', 'hummer', 'skaldjur'].some(k => name.includes(k))) {
    return false;
  }
  if (allergies.includes('sesam') && ['sesam'].some(k => name.includes(k))) {
    return false;
  }
  
  // Kolla kostpreferenser
  if (dietaryPreference === 'pescetariansk') {
    // Ingen kött
    if (['kyckling', 'nötfärs', 'fläsk', 'bacon', 'korv', 'falukorv', 'skinka', 'högrev', 'pulled pork', 
         'köttfärs', 'lamm', 'kalv', 'kött'].some(k => name.includes(k))) {
      return false;
    }
  }
  if (dietaryPreference === 'flexitariansk') {
    // Prioritera icke-kött, men filtrera inte bort
    // Returnerar true men kan sorteras lägre
  }
  
  return true;
};

interface AppState {
  userProfile: UserProfile | null;
  shoppingList: ShoppingList | null;
  
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  generateShoppingList: () => void;
  toggleShoppingItem: (store: Store, itemIndex: number) => void;
  addManualItem: (item: Omit<ShoppingItem, 'checked' | 'onSale' | 'isManuallyAdded'>) => void;
  removeManualItem: (index: number) => void;
  toggleManualItem: (index: number) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  resetApp: () => Promise<void>;
  
  // Getters
  getFilteredCampaigns: () => any[];
}

export const useAppStore = create<AppState>((set, get) => ({
  userProfile: null,
  shoppingList: null,

  setUserProfile: async (profile) => {
    set({ userProfile: profile });
    get().generateShoppingList();
    await get().saveToStorage();
  },

  getFilteredCampaigns: () => {
    const { userProfile } = get();
    if (!userProfile) return [];

    const currentCampaigns = getCurrentWeekCampaigns();
    
    // Filtrera baserat på valda butiker och användarpreferenser
    return currentCampaigns
      .filter(campaign => userProfile.selectedStores.includes(campaign.store))
      .filter(campaign => matchesPreferences(campaign, userProfile.dietaryPreference, userProfile.allergies))
      .sort((a, b) => b.discount - a.discount); // Högst rabatt först
  },

  generateShoppingList: () => {
    const { userProfile } = get();
    if (!userProfile) return;

    const filteredCampaigns = get().getFilteredCampaigns();

    // Skapa inköpslista baserad på kampanjer
    const byStore: Record<Store, ShoppingItem[]> = {
      ICA: [],
      Coop: [],
      Willys: [],
      Lidl: []
    };

    filteredCampaigns.forEach(campaign => {
      const item: ShoppingItem = {
        ingredient: campaign.ingredient,
        amount: 1,
        unit: 'st',
        onSale: true,
        discount: campaign.discount,
        checked: false,
        category: getIngredientCategory(campaign.ingredient),
        store: campaign.store,
        isManuallyAdded: false
      };
      
      byStore[campaign.store].push(item);
    });

    // Sortera varje butiks lista efter kategori
    const categoryOrder: IngredientCategory[] = [
      'Frukt & Grönt', 'Mejeri', 'Kött & Fågel', 'Fisk & Skaldjur', 
      'Bröd', 'Torrvaror', 'Drycker', 'Kryddor & Såser', 'Övrigt'
    ];
    
    Object.keys(byStore).forEach(store => {
      byStore[store as Store].sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.category);
        const indexB = categoryOrder.indexOf(b.category);
        return indexA - indexB;
      });
    });

    const totalItems = Object.values(byStore).reduce(
      (sum, items) => sum + items.length,
      0
    );

    set({
      shoppingList: {
        byStore,
        totalItems,
        manualItems: get().shoppingList?.manualItems || []
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
    if (!shoppingList) {
      set({
        shoppingList: {
          byStore: { ICA: [], Coop: [], Willys: [], Lidl: [] },
          totalItems: 0,
          manualItems: [{
            ...item,
            checked: false,
            onSale: false,
            isManuallyAdded: true
          }]
        }
      });
      return;
    }

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
        
        if (profile.onboardingCompleted) {
          get().generateShoppingList();
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
        shoppingList: null
      });
    } catch (error) {
      console.error('Failed to reset app:', error);
    }
  }
}));
