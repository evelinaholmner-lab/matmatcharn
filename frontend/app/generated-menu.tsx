import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colors } from './utils/colors';
import { useAppStore } from './store';
import { getCurrentWeekCampaigns } from './data/campaigns';

// Get flyer offers for API
const getFlyerOffersForStore = (store: string) => {
  // Import offers from flyers data
  const storeFlyers: Record<string, any[]> = {
    'ICA': [
      { name: 'Kex Ballerina/Brago/Singoalla', price: '2 för 30 kr', discount: '-35%', store: 'ICA' },
      { name: 'Skogaholmslimpa skivad', price: '2 för 45 kr', discount: '-25%', store: 'ICA' },
      { name: 'Bacon skivat Rydbergs', price: '99 kr/kg', discount: '-35%', store: 'ICA' },
      { name: 'Lax portionsbit', price: '2 för 99 kr', discount: '-30%', store: 'ICA' },
      { name: 'Blodapelsin i nät', price: '25 kr', discount: '-30%', store: 'ICA' },
      { name: 'Äpple Pink Lady', price: '30 kr/kg', discount: '-35%', store: 'ICA' },
      { name: 'Blandfärs 50/50', price: '49,90 kr', discount: '-35%', store: 'ICA' },
      { name: 'Fläskfilé', price: '69 kr/kg', discount: '-35%', store: 'ICA' },
      { name: 'Kvarg Lindahls', price: '2 för 40 kr', discount: '-30%', store: 'ICA' },
      { name: 'Yoghurt Arla', price: '25 kr', discount: '-35%', store: 'ICA' },
      { name: 'Ägg 24-pack', price: '49 kr', discount: '-30%', store: 'ICA' },
      { name: 'Ost Arla Ko', price: '99 kr/kg', discount: '-35%', store: 'ICA' },
      { name: 'Pasta Barilla', price: '2 för 25 kr', discount: '-30%', store: 'ICA' },
      { name: 'Ris Basmati/Jasmin', price: '44,90 kr', discount: '-30%', store: 'ICA' },
      { name: 'Broccoli/Morot', price: '2 för 18 kr', discount: '-40%', store: 'ICA' },
      { name: 'Champinjoner', price: '2 för 30 kr', discount: '-35%', store: 'ICA' },
      { name: 'Kycklingburgare/nuggets', price: '55 kr', discount: '-30%', store: 'ICA' },
      { name: 'Pizza Grandiosa', price: '3 för 99 kr', discount: '-30%', store: 'ICA' },
    ],
    'Coop': [
      { name: 'Kex Ballerina/Brago/Singoalla', price: '2 för 30 kr', discount: '-35%', store: 'Coop' },
      { name: 'Bacon skivat Rydbergs', price: '99 kr/kg', discount: '-35%', store: 'Coop' },
      { name: 'Porchetta Dalsjöfors', price: '95 kr/kg', discount: '-30%', store: 'Coop' },
      { name: 'Lax portionsbit', price: '2 för 99 kr', discount: '-30%', store: 'Coop' },
      { name: 'Blandfärs 50/50', price: '49,90 kr', discount: '-35%', store: 'Coop' },
      { name: 'Fläskfilé', price: '69 kr/kg', discount: '-35%', store: 'Coop' },
      { name: 'Kvarg Lindahls', price: '2 för 40 kr', discount: '-30%', store: 'Coop' },
      { name: 'Yoghurt Arla', price: '25 kr', discount: '-35%', store: 'Coop' },
      { name: 'Ägg 24-pack', price: '49 kr', discount: '-30%', store: 'Coop' },
      { name: 'Broccoli/Morot', price: '2 för 18 kr', discount: '-40%', store: 'Coop' },
      { name: 'Champinjoner', price: '2 för 30 kr', discount: '-35%', store: 'Coop' },
      { name: 'Pulled Chicken/Pork', price: '55 kr', discount: '-30%', store: 'Coop' },
      { name: 'Schnitzel panerad', price: '59,90 kr', discount: '-30%', store: 'Coop' },
      { name: 'Glass Sia Glass', price: '2 för 79 kr', discount: '-30%', store: 'Coop' },
    ],
    'Willys': [
      { name: 'Kex Ballerina/Brago/Singoalla', price: '2 för 30 kr', discount: '-35%', store: 'Willys' },
      { name: 'Bacon skivat Rydbergs', price: '99 kr/kg', discount: '-35%', store: 'Willys' },
      { name: 'Lax portionsbit', price: '2 för 99 kr', discount: '-30%', store: 'Willys' },
      { name: 'Blandfärs 50/50', price: '49,90 kr', discount: '-35%', store: 'Willys' },
      { name: 'Fläskfilé', price: '69 kr/kg', discount: '-35%', store: 'Willys' },
      { name: 'Fläskschnitzel', price: '99 kr/kg', discount: '-35%', store: 'Willys' },
      { name: 'Kvarg Lindahls', price: '2 för 40 kr', discount: '-30%', store: 'Willys' },
      { name: 'Yoghurt Arla', price: '25 kr', discount: '-35%', store: 'Willys' },
      { name: 'Ägg 24-pack', price: '49 kr', discount: '-30%', store: 'Willys' },
      { name: 'Broccoli/Morot', price: '2 för 18 kr', discount: '-40%', store: 'Willys' },
      { name: 'Champinjoner', price: '2 för 30 kr', discount: '-35%', store: 'Willys' },
      { name: 'Pasta Barilla', price: '2 för 25 kr', discount: '-30%', store: 'Willys' },
      { name: 'Tortilla Soft', price: '2 för 25 kr', discount: '-30%', store: 'Willys' },
      { name: 'Snacks OLW', price: '2 för 50 kr', discount: '-30%', store: 'Willys' },
    ],
    'Lidl': [
      { name: 'Bagels 6-pack', price: '29,90 kr', discount: '-25%', store: 'Lidl' },
      { name: 'Wienerbröd 4-pack', price: '39,90 kr', discount: '-30%', store: 'Lidl' },
      { name: 'Kassler', price: '2 för 69,90 kr', discount: '-25%', store: 'Lidl' },
      { name: 'Lax Varmrökt', price: '119 kr/kg', discount: '-30%', store: 'Lidl' },
      { name: 'Rökt makrill', price: '49,90 kr', discount: '-30%', store: 'Lidl' },
      { name: 'Blåbär', price: '34,90 kr', discount: '-30%', store: 'Lidl' },
      { name: 'Clementin', price: '19,90 kr/kg', discount: '-30%', store: 'Lidl' },
      { name: 'Vindruvor röda', price: '24,90 kr', discount: '-35%', store: 'Lidl' },
      { name: 'Morötter', price: '8,90 kr', discount: '-40%', store: 'Lidl' },
      { name: 'Paprikamix', price: '24,90 kr', discount: '-35%', store: 'Lidl' },
      { name: 'Bladfärs', price: '34,90 kr', discount: '-35%', store: 'Lidl' },
      { name: 'Kycklingfilé', price: '79,90 kr/kg', discount: '-35%', store: 'Lidl' },
      { name: 'Kycklinglår marinerade', price: '57,90 kr', discount: '-25%', store: 'Lidl' },
      { name: 'Fläskkarré', price: '74,90 kr/kg', discount: '-30%', store: 'Lidl' },
      { name: 'Smör svenskt', price: '49,90 kr', discount: '-25%', store: 'Lidl' },
      { name: 'Yoghurt Safari', price: '26,90 kr', discount: '-30%', store: 'Lidl' },
      { name: 'Ris basmati Abu Kass', price: '139 kr', discount: '-25%', store: 'Lidl' },
      { name: 'Chips Deluxe', price: '11,90 kr', discount: '-40%', store: 'Lidl' },
    ]
  };
  return storeFlyers[store] || [];
};

const dayNames: Record<string, string> = {
  monday: 'Måndag',
  tuesday: 'Tisdag',
  wednesday: 'Onsdag',
  thursday: 'Torsdag',
  friday: 'Fredag',
  saturday: 'Lördag',
  sunday: 'Söndag'
};

const mealIcons: Record<string, string> = {
  breakfast: 'sunny-outline',
  lunch: 'restaurant-outline',
  dinner: 'moon-outline',
  snack: 'cafe-outline'
};

const mealNames: Record<string, string> = {
  breakfast: 'Frukost',
  lunch: 'Lunch',
  dinner: 'Middag',
  snack: 'Mellanmål'
};

interface MenuData {
  weeklyMenu: Record<string, Record<string, string>>;
  shoppingList: Record<string, Array<{item: string; amount: string; price: string}>>;
  totalEstimate: string;
  savings: string;
  recipeTips: Array<{title: string; ingredients: string[]; steps: string[]}>;
}

export default function GeneratedMenuScreen() {
  const router = useRouter();
  const { userProfile } = useAppStore();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [activeTab, setActiveTab] = useState<'menu' | 'shopping' | 'recipes'>('menu');
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = Constants.expoConfig?.extra?.EXPO_BACKEND_URL || '';

  const generateMenu = async () => {
    if (!userProfile) {
      setError('Ingen användarprofil hittades');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Collect all discounts for selected stores
      const discounts: any[] = [];
      userProfile.selectedStores.forEach(store => {
        const storeOffers = getFlyerOffersForStore(store);
        discounts.push(...storeOffers);
      });

      const response = await fetch(`${API_URL}/api/generate-menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numberOfPeople: userProfile.numberOfPeople,
          dietaryPreference: userProfile.dietaryPreference,
          allergies: userProfile.allergies,
          location: userProfile.location,
          selectedStores: userProfile.selectedStores,
          discounts: discounts
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate menu');
      }

      const data = await response.json();
      setMenuData(data);
    } catch (err) {
      console.error('Error generating menu:', err);
      setError('Kunde inte generera veckomeny. Försök igen.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    generateMenu();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    generateMenu();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Skapar din personliga veckomeny...</Text>
          <Text style={styles.loadingSubtext}>AI analyserar veckans rabatter</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={generateMenu}>
            <Text style={styles.retryButtonText}>Försök igen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => router.replace('/weekly-plan')}>
            <Text style={styles.skipButtonText}>Gå till inköpslista istället</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.replace('/weekly-plan')}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Din Veckomeny</Text>
          <Text style={styles.headerSubtitle}>Vecka 7 • AI-genererad</Text>
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Savings Banner */}
      {menuData?.savings && (
        <View style={styles.savingsBanner}>
          <Ionicons name="pricetag" size={20} color="#fff" />
          <Text style={styles.savingsText}>
            Uppskattad besparing: {menuData.savings}
          </Text>
        </View>
      )}

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
          onPress={() => setActiveTab('menu')}
        >
          <Ionicons name="calendar" size={20} color={activeTab === 'menu' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>Meny</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'shopping' && styles.activeTab]}
          onPress={() => setActiveTab('shopping')}
        >
          <Ionicons name="cart" size={20} color={activeTab === 'shopping' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'shopping' && styles.activeTabText]}>Inköpslista</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
          onPress={() => setActiveTab('recipes')}
        >
          <Ionicons name="book" size={20} color={activeTab === 'recipes' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>Recept</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'menu' && menuData?.weeklyMenu && (
          <>
            {/* Day Selector */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.daySelector}
              contentContainerStyle={styles.daySelectorContent}
            >
              {Object.keys(dayNames).map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>
                    {dayNames[day]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Meals for Selected Day */}
            <View style={styles.mealsContainer}>
              {menuData.weeklyMenu[selectedDay] && Object.entries(menuData.weeklyMenu[selectedDay]).map(([meal, description]) => (
                <View key={meal} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <View style={styles.mealIconContainer}>
                      <Ionicons 
                        name={mealIcons[meal] as any || 'restaurant-outline'} 
                        size={24} 
                        color={colors.primary} 
                      />
                    </View>
                    <Text style={styles.mealTitle}>{mealNames[meal] || meal}</Text>
                  </View>
                  <Text style={styles.mealDescription}>{description}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'shopping' && menuData?.shoppingList && (
          <View style={styles.shoppingContainer}>
            <View style={styles.totalBanner}>
              <Text style={styles.totalLabel}>Uppskattad totalkostnad:</Text>
              <Text style={styles.totalAmount}>{menuData.totalEstimate}</Text>
            </View>
            
            {Object.entries(menuData.shoppingList).map(([store, items]) => (
              <View key={store} style={styles.storeSection}>
                <View style={styles.storeHeader}>
                  <Ionicons name="storefront" size={20} color={colors.primary} />
                  <Text style={styles.storeName}>{store}</Text>
                  <Text style={styles.itemCount}>{items.length} varor</Text>
                </View>
                {items.map((item, index) => (
                  <View key={index} style={styles.shoppingItem}>
                    <View style={styles.shoppingItemLeft}>
                      <Text style={styles.shoppingItemName}>{item.item}</Text>
                      <Text style={styles.shoppingItemAmount}>{item.amount}</Text>
                    </View>
                    <Text style={styles.shoppingItemPrice}>{item.price}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'recipes' && menuData?.recipeTips && (
          <View style={styles.recipesContainer}>
            {menuData.recipeTips.map((recipe, index) => (
              <View key={index} style={styles.recipeCard}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                
                <View style={styles.ingredientsSection}>
                  <Text style={styles.sectionLabel}>Ingredienser:</Text>
                  {recipe.ingredients.map((ing, i) => (
                    <View key={i} style={styles.ingredientRow}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                      <Text style={styles.ingredientText}>{ing}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.stepsSection}>
                  <Text style={styles.sectionLabel}>Gör så här:</Text>
                  {recipe.steps.map((step, i) => (
                    <View key={i} style={styles.stepRow}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.replace('/shopping-list')}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Gå till inköpslistan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  skipButtonText: {
    color: colors.textLight,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 10,
    gap: 8,
  },
  savingsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  daySelector: {
    backgroundColor: colors.cardBackground,
    maxHeight: 60,
  },
  daySelectorContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
  },
  dayButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedDayButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  mealsContainer: {
    padding: 16,
    gap: 12,
  },
  mealCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  mealDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginLeft: 52,
  },
  shoppingContainer: {
    padding: 16,
  },
  totalBanner: {
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  storeSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  itemCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  shoppingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  shoppingItemLeft: {
    flex: 1,
  },
  shoppingItemName: {
    fontSize: 14,
    color: colors.text,
  },
  shoppingItemAmount: {
    fontSize: 12,
    color: colors.textLight,
  },
  shoppingItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  recipesContainer: {
    padding: 16,
    gap: 16,
  },
  recipeCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  ingredientsSection: {
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  ingredientText: {
    fontSize: 14,
    color: colors.textLight,
  },
  stepsSection: {},
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  bottomAction: {
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
