import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from './store';
import { Card } from './components/Card';
import { colors } from './utils/colors';
import { Store } from './types';
import { Ionicons } from '@expo/vector-icons';

const STORE_COLORS: Record<Store, string> = {
  ICA: '#E3000F',
  Coop: '#00A94F',
  Willys: '#FF6B00',
};

export default function ShoppingList() {
  const router = useRouter();
  const { shoppingList, userProfile, toggleShoppingItem } = useAppStore();
  const [selectedStore, setSelectedStore] = useState<Store>(
    userProfile?.selectedStores[0] || 'ICA'
  );

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

  const storeItems = shoppingList.byStore[selectedStore] || [];
  const checkedCount = storeItems.filter(item => item.checked).length;
  const totalCount = storeItems.length;
  const progress = totalCount > 0 ? checkedCount / totalCount : 0;

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
          <Text style={styles.headerTitle}>Shoppinglista</Text>
          <Text style={styles.headerSubtitle}>
            {checkedCount} av {totalCount} varor klara
          </Text>
        </View>
      </View>

      {/* Store Tabs */}
      <View style={styles.storeTabs}>
        {userProfile.selectedStores.map((store) => {
          const storeItemCount = shoppingList.byStore[store]?.length || 0;
          const isSelected = selectedStore === store;
          
          return (
            <TouchableOpacity
              key={store}
              style={[
                styles.storeTab,
                isSelected && styles.storeTabSelected,
                { borderBottomColor: STORE_COLORS[store] }
              ]}
              onPress={() => setSelectedStore(store)}
            >
              <View style={styles.storeTabContent}>
                <View style={[styles.storeIcon, { backgroundColor: STORE_COLORS[store] + '20' }]}>
                  <Ionicons name="storefront" size={16} color={STORE_COLORS[store]} />
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
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Shopping Items */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {storeItems.length === 0 ? (
          <View style={styles.emptyStore}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text style={styles.emptyStoreText}>Inga varor för denna butik</Text>
          </View>
        ) : (
          <Card>
            {storeItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.item,
                  index !== storeItems.length - 1 && styles.itemBorder
                ]}
                onPress={() => toggleShoppingItem(selectedStore, index)}
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
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Tips */}
        {storeItems.some(item => item.onSale) && (
          <View style={styles.tip}>
            <Ionicons name="bulb" size={20} color={colors.accent} />
            <Text style={styles.tipText}>
              Varor med prislapp är på kampanj denna vecka!
            </Text>
          </View>
        )}
      </ScrollView>
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
  storeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  storeTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  storeTabSelected: {
    borderBottomWidth: 3,
  },
  storeTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 14,
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
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
});