import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from './store';
import { Card } from './components/Card';
import { colors } from './utils/colors';
import { Store, IngredientCategory, ShoppingItem } from './types';
import { Ionicons } from '@expo/vector-icons';

const STORE_COLORS: Record<Store, string> = {
  ICA: '#E3000F',
  Coop: '#00A94F',
  Willys: '#FF6B00',
  Lidl: '#0050AA',
};

const CATEGORY_ICONS: Record<IngredientCategory, string> = {
  'Mejeri': 'water',
  'Kött & Fågel': 'restaurant',
  'Fisk & Skaldjur': 'fish',
  'Frukt & Grönt': 'leaf',
  'Torrvaror': 'cube',
  'Bröd': 'pizza',
  'Kryddor & Såser': 'flask',
  'Övrigt': 'ellipsis-horizontal',
};

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  'Mejeri': '#B8E0FF',
  'Kött & Fågel': '#FFD4D4',
  'Fisk & Skaldjur': '#D4F1FF',
  'Frukt & Grönt': '#D4FFD4',
  'Torrvaror': '#FFE8D4',
  'Bröd': '#FFE5B4',
  'Kryddor & Såser': '#E8D4FF',
  'Övrigt': '#E0E0E0',
};

const CATEGORY_OPTIONS: IngredientCategory[] = [
  'Frukt & Grönt', 'Mejeri', 'Kött & Fågel', 'Fisk & Skaldjur',
  'Bröd', 'Torrvaror', 'Kryddor & Såser', 'Övrigt'
];

export default function ShoppingList() {
  const router = useRouter();
  const { 
    shoppingList, 
    userProfile, 
    toggleShoppingItem,
    addManualItem,
    removeManualItem,
    toggleManualItem
  } = useAppStore();
  
  const [selectedStore, setSelectedStore] = useState<Store | 'manual'>(
    userProfile?.selectedStores[0] || 'ICA'
  );
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('st');
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>('Övrigt');

  if (!shoppingList || !userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>Ingen shoppinglista tillgänglig</Text>
        </View>
      </SafeAreaView>
    );
  }

  const storeItems = selectedStore === 'manual' 
    ? shoppingList.manualItems 
    : (shoppingList.byStore[selectedStore] || []);
    
  const checkedCount = storeItems.filter(item => item.checked).length;
  const totalCount = storeItems.length;
  const progress = totalCount > 0 ? checkedCount / totalCount : 0;

  // Gruppera varor efter kategori
  const groupedItems = storeItems.reduce((acc, item, index) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ item, originalIndex: index });
    return acc;
  }, {} as Record<IngredientCategory, Array<{ item: ShoppingItem; originalIndex: number }>>);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addManualItem({
        ingredient: newItemName.trim(),
        amount: parseFloat(newItemAmount) || 1,
        unit: newItemUnit,
        category: newItemCategory
      });
      setNewItemName('');
      setNewItemAmount('');
      setNewItemUnit('st');
      setNewItemCategory('Övrigt');
      setAddItemModalVisible(false);
    }
  };

  const handleToggleItem = (index: number) => {
    if (selectedStore === 'manual') {
      toggleManualItem(index);
    } else {
      toggleShoppingItem(selectedStore, index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Inköpslista</Text>
          <Text style={styles.headerSubtitle}>
            {checkedCount} av {totalCount} varor klara
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddItemModalVisible(true)}
        >
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Store Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.storeTabsContainer}
        contentContainerStyle={styles.storeTabsContent}
      >
        {userProfile.selectedStores.map((store) => {
          const storeItemCount = shoppingList.byStore[store]?.length || 0;
          const isSelected = selectedStore === store;
          
          return (
            <TouchableOpacity
              key={store}
              style={[
                styles.storeTab,
                isSelected && styles.storeTabSelected,
                { borderBottomColor: isSelected ? STORE_COLORS[store] : 'transparent' }
              ]}
              onPress={() => setSelectedStore(store)}
            >
              <View style={styles.storeTabContent}>
                <View style={[styles.storeIcon, { backgroundColor: STORE_COLORS[store] + '20' }]}>
                  <Ionicons name="storefront" size={14} color={STORE_COLORS[store]} />
                </View>
                <Text style={[
                  styles.storeTabText,
                  isSelected && styles.storeTabTextSelected
                ]}>
                  {store}
                </Text>
                <View style={[styles.badge, { backgroundColor: STORE_COLORS[store] }]}>
                  <Text style={styles.badgeText}>{storeItemCount}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        
        {/* Manual items tab */}
        <TouchableOpacity
          style={[
            styles.storeTab,
            selectedStore === 'manual' && styles.storeTabSelected,
            { borderBottomColor: selectedStore === 'manual' ? colors.primary : 'transparent' }
          ]}
          onPress={() => setSelectedStore('manual')}
        >
          <View style={styles.storeTabContent}>
            <View style={[styles.storeIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="create" size={14} color={colors.primary} />
            </View>
            <Text style={[
              styles.storeTabText,
              selectedStore === 'manual' && styles.storeTabTextSelected
            ]}>
              Egna
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{shoppingList.manualItems.length}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Shopping Items by Category */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {storeItems.length === 0 ? (
          <View style={styles.emptyStore}>
            <Ionicons 
              name={selectedStore === 'manual' ? 'create-outline' : 'checkmark-circle'} 
              size={48} 
              color={selectedStore === 'manual' ? colors.primary : colors.success} 
            />
            <Text style={styles.emptyStoreText}>
              {selectedStore === 'manual' 
                ? 'Lägg till egna varor med + knappen' 
                : 'Inga varor för denna butik'}
            </Text>
          </View>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <View style={[styles.categoryHeader, { backgroundColor: CATEGORY_COLORS[category as IngredientCategory] }]}>
                <Ionicons 
                  name={CATEGORY_ICONS[category as IngredientCategory] as any} 
                  size={18} 
                  color={colors.text} 
                />
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryCount}>{items.length}</Text>
              </View>
              
              <Card style={styles.categoryCard}>
                {items.map(({ item, originalIndex }, idx) => (
                  <TouchableOpacity
                    key={originalIndex}
                    style={[
                      styles.item,
                      idx !== items.length - 1 && styles.itemBorder
                    ]}
                    onPress={() => handleToggleItem(originalIndex)}
                    onLongPress={() => {
                      if (selectedStore === 'manual') {
                        removeManualItem(originalIndex);
                      }
                    }}
                  >
                    <View style={styles.checkbox}>
                      {item.checked ? (
                        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                      ) : (
                        <View style={styles.checkboxEmpty} />
                      )}
                    </View>

                    <View style={styles.itemInfo}>
                      <Text style={[
                        styles.itemName,
                        item.checked && styles.itemNameChecked
                      ]}>
                        {item.ingredient}
                      </Text>
                      <Text style={styles.itemAmount}>
                        {item.amount} {item.unit}
                      </Text>
                    </View>

                    {item.onSale && (
                      <View style={styles.saleTag}>
                        <Ionicons name="pricetag" size={12} color={colors.textInverse} />
                        <Text style={styles.saleText}>-{item.discount}%</Text>
                      </View>
                    )}
                    
                    {item.isManuallyAdded && (
                      <View style={styles.manualTag}>
                        <Ionicons name="create" size={12} color={colors.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          ))
        )}

        {/* Tips */}
        {storeItems.some(item => item.onSale) && (
          <View style={styles.tip}>
            <Ionicons name="bulb" size={20} color={colors.accent} />
            <Text style={styles.tipText}>
              Varor med prislapp är på kampanj denna vecka! Matsedeln är optimerad för att maximera dina besparingar.
            </Text>
          </View>
        )}

        {selectedStore === 'manual' && shoppingList.manualItems.length > 0 && (
          <View style={styles.tip}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.tipText}>
              Tryck länge på en vara för att ta bort den.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={addItemModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddItemModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lägg till vara</Text>
              <TouchableOpacity onPress={() => setAddItemModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Varunamn</Text>
              <TextInput
                style={styles.textInput}
                placeholder="T.ex. Mjölk, Bröd..."
                placeholderTextColor={colors.textLight}
                value={newItemName}
                onChangeText={setNewItemName}
                autoFocus
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Antal</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="1"
                    placeholderTextColor={colors.textLight}
                    value={newItemAmount}
                    onChangeText={setNewItemAmount}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Enhet</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="st"
                    placeholderTextColor={colors.textLight}
                    value={newItemUnit}
                    onChangeText={setNewItemUnit}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Kategori</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryPicker}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      { backgroundColor: CATEGORY_COLORS[cat] },
                      newItemCategory === cat && styles.categoryOptionSelected
                    ]}
                    onPress={() => setNewItemCategory(cat)}
                  >
                    <Ionicons 
                      name={CATEGORY_ICONS[cat] as any} 
                      size={16} 
                      color={colors.text} 
                    />
                    <Text style={styles.categoryOptionText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity 
                style={[
                  styles.addItemButton,
                  !newItemName.trim() && styles.addItemButtonDisabled
                ]}
                onPress={handleAddItem}
                disabled={!newItemName.trim()}
              >
                <Ionicons name="add" size={20} color={colors.textInverse} />
                <Text style={styles.addItemButtonText}>Lägg till</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  addButton: {
    padding: 4,
  },
  storeTabsContainer: {
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 60,
  },
  storeTabsContent: {
    paddingHorizontal: 8,
  },
  storeTab: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  storeTabSelected: {
    borderBottomWidth: 3,
  },
  storeTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
  },
  storeTabTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textInverse,
  },
  progressContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryCard: {
    padding: 0,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  itemAmount: {
    fontSize: 14,
    color: colors.textLight,
  },
  saleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  saleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textInverse,
  },
  manualTag: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textLight,
    marginTop: 16,
  },
  emptyStore: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStoreText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 16,
    textAlign: 'center',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.accentLight + '30',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  modalBody: {
    padding: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  categoryPicker: {
    marginBottom: 24,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryOptionSelected: {
    borderColor: colors.primary,
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addItemButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  addItemButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textInverse,
  },
});
