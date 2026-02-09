import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colors } from './utils/colors';
import { useAppStore } from './store';

// Get flyer offers for API
const getFlyerOffersForStore = (store: string) => {
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

interface ShoppingItemLocal {
  id: string;
  item: string;
  amount: string;
  price: string;
  checked: boolean;
  isManual?: boolean;
}

interface MenuData {
  weeklyMenu: Record<string, Record<string, string>>;
  shoppingList: Record<string, Array<{item: string; amount: string; price: string}>>;
  totalEstimate: string;
  savings: string;
}

export default function GeneratedMenuScreen() {
  const router = useRouter();
  const { userProfile } = useAppStore();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'shopping' | 'add'>('menu');
  const [refreshing, setRefreshing] = useState(false);
  
  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Manual items state
  const [manualItems, setManualItems] = useState<ShoppingItemLocal[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

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
          dietaryPreferences: userProfile.dietaryPreferences,
          allergies: userProfile.allergies,
          location: userProfile.location,
          selectedStores: userProfile.selectedStores,
          selectedMeals: userProfile.selectedMeals,
          lunchboxCount: userProfile.lunchboxCount,
          wantsBatchCooking: userProfile.wantsBatchCooking,
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

  const toggleItemCheck = useCallback((itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  }, []);

  const toggleManualItemCheck = useCallback((itemId: string) => {
    setManualItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  }, []);

  const addManualItem = useCallback(() => {
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingItemLocal = {
      id: `manual-${Date.now()}`,
      item: newItemName.trim(),
      amount: newItemAmount.trim() || '1 st',
      price: '',
      checked: false,
      isManual: true
    };
    
    setManualItems(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemAmount('');
    setActiveTab('shopping');
  }, [newItemName, newItemAmount]);

  const removeManualItem = useCallback((itemId: string) => {
    setManualItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // Calculate checked counts
  const getCheckedStats = () => {
    if (!menuData?.shoppingList) return { checked: 0, total: 0 };
    
    let total = manualItems.length;
    let checked = manualItems.filter(i => i.checked).length;
    
    Object.entries(menuData.shoppingList).forEach(([store, items]) => {
      items.forEach((item, index) => {
        total++;
        if (checkedItems[`${store}-${index}`]) checked++;
      });
    });
    
    return { checked, total };
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
            <Text style={styles.skipButtonText}>Gå till kampanjer istället</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stats = getCheckedStats();

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
          <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>Veckomeny</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'shopping' && styles.activeTab]}
          onPress={() => setActiveTab('shopping')}
        >
          <Ionicons name="checkbox" size={20} color={activeTab === 'shopping' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'shopping' && styles.activeTabText]}>
            Inköp ({stats.checked}/{stats.total})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'add' && styles.activeTab]}
          onPress={() => setActiveTab('add')}
        >
          <Ionicons name="add-circle" size={20} color={activeTab === 'add' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>Lägg till</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
        >
          {/* MENU TAB - All days in one view */}
          {activeTab === 'menu' && menuData?.weeklyMenu && (
            <View style={styles.menuContainer}>
              {Object.entries(dayNames).map(([dayKey, dayLabel]) => (
                <View key={dayKey} style={styles.daySection}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayTitle}>{dayLabel}</Text>
                  </View>
                  
                  {menuData.weeklyMenu[dayKey] && (
                    <View style={styles.mealsGrid}>
                      {Object.entries(menuData.weeklyMenu[dayKey]).map(([meal, description]) => (
                        <View key={meal} style={styles.mealCard}>
                          <View style={styles.mealHeader}>
                            <View style={styles.mealIconContainer}>
                              <Ionicons 
                                name={mealIcons[meal] as any || 'restaurant-outline'} 
                                size={18} 
                                color={colors.primary} 
                              />
                            </View>
                            <Text style={styles.mealTitle}>{mealNames[meal] || meal}</Text>
                          </View>
                          <Text style={styles.mealDescription} numberOfLines={3}>{description}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* SHOPPING TAB - Checklist */}
          {activeTab === 'shopping' && menuData?.shoppingList && (
            <View style={styles.shoppingContainer}>
              <View style={styles.totalBanner}>
                <View>
                  <Text style={styles.totalLabel}>Uppskattad totalkostnad</Text>
                  <Text style={styles.totalAmount}>{menuData.totalEstimate}</Text>
                </View>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressText}>{Math.round((stats.checked / stats.total) * 100)}%</Text>
                </View>
              </View>
              
              {/* Manual items first */}
              {manualItems.length > 0 && (
                <View style={styles.storeSection}>
                  <View style={styles.storeHeader}>
                    <Ionicons name="person" size={20} color={colors.primary} />
                    <Text style={styles.storeName}>Egna varor</Text>
                    <Text style={styles.itemCount}>{manualItems.length} varor</Text>
                  </View>
                  {manualItems.map((item) => (
                    <TouchableOpacity 
                      key={item.id} 
                      style={styles.shoppingItem}
                      onPress={() => toggleManualItemCheck(item.id)}
                    >
                      <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                        {item.checked && <Ionicons name="checkmark" size={16} color="#fff" />}
                      </View>
                      <View style={styles.shoppingItemLeft}>
                        <Text style={[styles.shoppingItemName, item.checked && styles.itemCheckedText]}>
                          {item.item}
                        </Text>
                        <Text style={styles.shoppingItemAmount}>{item.amount}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => removeManualItem(item.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Store items */}
              {Object.entries(menuData.shoppingList).map(([store, items]) => (
                <View key={store} style={styles.storeSection}>
                  <View style={styles.storeHeader}>
                    <Ionicons name="storefront" size={20} color={colors.primary} />
                    <Text style={styles.storeName}>{store}</Text>
                    <Text style={styles.itemCount}>{items.length} varor</Text>
                  </View>
                  {items.map((item, index) => {
                    const itemId = `${store}-${index}`;
                    const isChecked = checkedItems[itemId];
                    return (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.shoppingItem}
                        onPress={() => toggleItemCheck(itemId)}
                      >
                        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                          {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
                        </View>
                        <View style={styles.shoppingItemLeft}>
                          <Text style={[styles.shoppingItemName, isChecked && styles.itemCheckedText]}>
                            {item.item}
                          </Text>
                          <Text style={styles.shoppingItemAmount}>{item.amount}</Text>
                        </View>
                        <Text style={[styles.shoppingItemPrice, isChecked && styles.itemCheckedText]}>
                          {item.price}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          )}

          {/* ADD TAB - Add manual items */}
          {activeTab === 'add' && (
            <View style={styles.addContainer}>
              <View style={styles.addCard}>
                <Text style={styles.addTitle}>Lägg till egen vara</Text>
                <Text style={styles.addHint}>Lägg till varor som inte finns i den genererade listan</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Vara *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="T.ex. Mjölk"
                    value={newItemName}
                    onChangeText={setNewItemName}
                    returnKeyType="next"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mängd (valfritt)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="T.ex. 2 liter"
                    value={newItemAmount}
                    onChangeText={setNewItemAmount}
                    returnKeyType="done"
                    onSubmitEditing={addManualItem}
                  />
                </View>
                
                <TouchableOpacity 
                  style={[styles.addButton, !newItemName.trim() && styles.addButtonDisabled]}
                  onPress={addManualItem}
                  disabled={!newItemName.trim()}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Lägg till i listan</Text>
                </TouchableOpacity>
              </View>

              {manualItems.length > 0 && (
                <View style={styles.manualListPreview}>
                  <Text style={styles.previewTitle}>Dina tillagda varor ({manualItems.length})</Text>
                  {manualItems.map(item => (
                    <View key={item.id} style={styles.previewItem}>
                      <Text style={styles.previewItemText}>{item.item}</Text>
                      <Text style={styles.previewItemAmount}>{item.amount}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
    fontSize: 13,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Menu styles
  menuContainer: {
    padding: 16,
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  mealsGrid: {
    gap: 10,
  },
  mealCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  mealIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  mealDescription: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
    marginLeft: 42,
  },
  // Shopping styles
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
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
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  shoppingItemLeft: {
    flex: 1,
  },
  shoppingItemName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  itemCheckedText: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
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
  deleteButton: {
    padding: 8,
  },
  // Add tab styles
  addContainer: {
    padding: 16,
  },
  addCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
  },
  addTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  addHint: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  manualListPreview: {
    marginTop: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  previewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  previewItemText: {
    fontSize: 14,
    color: colors.text,
  },
  previewItemAmount: {
    fontSize: 14,
    color: colors.textLight,
  },
});
