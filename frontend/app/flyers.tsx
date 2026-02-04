import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './utils/colors';
import { useAppStore } from './store';
import { Store, IngredientCategory } from './types';

interface FlyerOffer {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  unit?: string;
  category: IngredientCategory;
}

interface StoreFlyer {
  store: Store;
  storeName: string;
  color: string;
  validFrom: string;
  validTo: string;
  weekNumber: number;
  offers: FlyerOffer[];
}

// Erbjudanden per butik
const storeFlyers: StoreFlyer[] = [
  {
    store: 'ICA',
    storeName: 'ICA Supermarket',
    color: '#E3000F',
    validFrom: '2/2',
    validTo: '8/2',
    weekNumber: 6,
    offers: [
      { id: 'ica-o1', name: 'Riven Cheddar & Mozzarella', price: '20 kr', originalPrice: '30 kr', discount: '-35%', unit: '150g', category: 'Mejeri' },
      { id: 'ica-o2', name: 'Pasta ICA', price: '10 kr', originalPrice: '15 kr', discount: '-33%', unit: '500g', category: 'Torrvaror' },
      { id: 'ica-o3', name: 'Tomater', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: 'förp', category: 'Frukt & Grönt' },
      { id: 'ica-o4', name: 'Päron', price: '15 kr', originalPrice: '25 kr', discount: '-40%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'ica-o5', name: 'Oatly iKaffe', price: '2 för 30 kr', originalPrice: '19,90 kr/st', discount: '-25%', unit: '1L', category: 'Mejeri' },
      { id: 'ica-o6', name: 'Mogen Mango', price: '2 för 25 kr', originalPrice: '15 kr/st', discount: '-35%', unit: 'st', category: 'Frukt & Grönt' },
      { id: 'ica-o7', name: 'Ägg ICA', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: '12-pack', category: 'Mejeri' },
      { id: 'ica-o8', name: 'Kycklingfilé', price: '89 kr', originalPrice: '129 kr', discount: '-31%', unit: 'kg', category: 'Kött & Fågel' },
    ]
  },
  {
    store: 'Coop',
    storeName: 'Coop',
    color: '#00A94F',
    validFrom: '2/2',
    validTo: '8/2',
    weekNumber: 6,
    offers: [
      { id: 'coop-o1', name: 'Arla Yoghurt', price: '2 för 35 kr', originalPrice: '22 kr/st', discount: '-20%', unit: '1kg', category: 'Mejeri' },
      { id: 'coop-o2', name: 'Apelsiner', price: '17 kr', originalPrice: '29 kr', discount: '-40%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'coop-o3', name: 'Scan Baconskivor', price: '39,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '420g', category: 'Kött & Fågel' },
      { id: 'coop-o4', name: 'Sport Knäckebröd', price: '2 för 39 kr', originalPrice: '25 kr/st', discount: '-22%', unit: '550g', category: 'Bröd' },
      { id: 'coop-o5', name: 'Skogaholmslimpa', price: '22,90 kr', originalPrice: '30 kr', discount: '-25%', unit: '775g', category: 'Bröd' },
      { id: 'coop-o6', name: 'Oatly iKaffe', price: '2 för 35 kr', originalPrice: '22 kr/st', discount: '-20%', unit: '1L', category: 'Mejeri' },
      { id: 'coop-o7', name: 'Nötfärs', price: '79 kr', originalPrice: '109 kr', discount: '-28%', unit: 'kg', category: 'Kött & Fågel' },
    ]
  },
  {
    store: 'Willys',
    storeName: 'Willys',
    color: '#FF6B00',
    validFrom: '2/2',
    validTo: '8/2',
    weekNumber: 6,
    offers: [
      { id: 'willys-o1', name: 'Gouda Familjefavoriter', price: '79,90 kr', originalPrice: '109 kr', discount: '-30%', unit: 'kg', category: 'Mejeri' },
      { id: 'willys-o2', name: 'Falukorv Garant', price: '19,90 kr', originalPrice: '35,90 kr', discount: '-45%', unit: '800g', category: 'Kött & Fågel' },
      { id: 'willys-o3', name: 'Högrev Nötkött', price: '118 kr', originalPrice: '165 kr', discount: '-30%', unit: 'kg', category: 'Kött & Fågel' },
      { id: 'willys-o4', name: 'Vitkål Import', price: '4,90 kr', originalPrice: '12,90 kr', discount: '-60%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'willys-o5', name: 'Kokosgrädde Garant', price: '2 för 24 kr', originalPrice: '14,90 kr/st', discount: '-20%', unit: '250ml', category: 'Mejeri' },
      { id: 'willys-o6', name: 'Daloon Vårrullar', price: '29,90 kr', originalPrice: '47,90 kr', discount: '-40%', unit: '800g', category: 'Övrigt' },
      { id: 'willys-o7', name: 'Rice Noodles', price: '17,90 kr', discount: '-15%', unit: '180g', category: 'Torrvaror' },
      { id: 'willys-o8', name: 'Pepsi Max Flak', price: '79,90 kr', originalPrice: '119 kr', discount: '-33%', unit: '20x33cl', category: 'Drycker' },
    ]
  },
  {
    store: 'Lidl',
    storeName: 'Lidl',
    color: '#0050AA',
    validFrom: '2/2',
    validTo: '8/2',
    weekNumber: 6,
    offers: [
      { id: 'lidl-o1', name: 'Gul Lök', price: '5,90 kr', originalPrice: '11,90 kr', discount: '-50%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'lidl-o2', name: 'Ananas', price: '16,90 kr', originalPrice: '27,90 kr', discount: '-40%', unit: 'st', category: 'Frukt & Grönt' },
      { id: 'lidl-o3', name: 'Päron', price: '17,90 kr', originalPrice: '27 kr', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'lidl-o4', name: 'Jordgubbar', price: '39,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '400g', category: 'Frukt & Grönt' },
      { id: 'lidl-o5', name: 'Kronfågel Kycklinglårfilé', price: '119 kr', originalPrice: '169 kr', discount: '-30%', unit: 'kg', category: 'Kött & Fågel' },
      { id: 'lidl-o6', name: 'Marinerad Kycklingfilé', price: '99 kr', originalPrice: '149 kr', discount: '-35%', unit: 'förp', category: 'Kött & Fågel' },
      { id: 'lidl-o7', name: 'Pulled Pork', price: '49,90 kr', originalPrice: '69,90 kr', discount: '-30%', unit: 'förp', category: 'Kött & Fågel' },
      { id: 'lidl-o8', name: 'Gravad/Kallrökt Lax', price: '109 kr', originalPrice: '139 kr', discount: '-22%', unit: 'förp', category: 'Fisk & Skaldjur' },
    ]
  },
];

export default function FlyersScreen() {
  const router = useRouter();
  const { addManualItem } = useAppStore();
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);

  const currentFlyer = storeFlyers[selectedStoreIndex];

  const handleAddToList = useCallback((offer: FlyerOffer) => {
    addManualItem({
      ingredient: offer.name,
      amount: 1,
      unit: offer.unit || 'st',
      category: offer.category
    });
    Alert.alert(
      '✓ Tillagd i listan',
      `${offer.name} har lagts till i din inköpslista.`,
      [{ text: 'OK' }]
    );
  }, [addManualItem]);

  const renderOfferItem = useCallback(({ item }: { item: FlyerOffer }) => (
    <TouchableOpacity
      style={styles.offerItem}
      onPress={() => handleAddToList(item)}
    >
      <View style={styles.offerLeft}>
        {item.discount && (
          <View style={[styles.offerBadge, { backgroundColor: currentFlyer.color }]}>
            <Text style={styles.offerBadgeText}>{item.discount}</Text>
          </View>
        )}
        <View style={styles.offerTextContainer}>
          <Text style={styles.offerName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.offerUnit}>{item.unit}</Text>
        </View>
      </View>
      <View style={styles.offerRight}>
        <Text style={[styles.offerPrice, { color: currentFlyer.color }]}>{item.price}</Text>
        {item.originalPrice && (
          <Text style={styles.offerOriginalPrice}>{item.originalPrice}</Text>
        )}
      </View>
      <View style={[styles.addButton, { backgroundColor: currentFlyer.color }]}>
        <Ionicons name="add" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  ), [currentFlyer.color, handleAddToList]);

  // Gruppera erbjudanden efter kategori
  const groupedOffers = currentFlyer.offers.reduce((acc, offer) => {
    if (!acc[offer.category]) {
      acc[offer.category] = [];
    }
    acc[offer.category].push(offer);
    return acc;
  }, {} as Record<string, FlyerOffer[]>);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Veckans Erbjudanden</Text>
          <Text style={styles.headerWeek}>Vecka {currentFlyer.weekNumber}</Text>
        </View>

        <View style={styles.headerButton} />
      </View>

      {/* Store Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.storeSelector}
        contentContainerStyle={styles.storeSelectorContent}
      >
        {storeFlyers.map((flyer, index) => (
          <TouchableOpacity
            key={flyer.store}
            style={[
              styles.storeButton,
              selectedStoreIndex === index && { 
                backgroundColor: flyer.color + '15',
                borderColor: flyer.color 
              }
            ]}
            onPress={() => setSelectedStoreIndex(index)}
          >
            <View style={[styles.storeIcon, { backgroundColor: flyer.color }]}>
              <Ionicons name="storefront" size={16} color="#fff" />
            </View>
            <Text style={[
              styles.storeButtonText,
              selectedStoreIndex === index && { color: flyer.color, fontWeight: '700' }
            ]}>
              {flyer.store}
            </Text>
            <Text style={styles.storeOfferCount}>
              {flyer.offers.length} erbjudanden
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Validity Banner */}
      <View style={[styles.validityBanner, { backgroundColor: currentFlyer.color }]}>
        <Ionicons name="calendar-outline" size={16} color="#fff" />
        <Text style={styles.validityText}>
          Gäller {currentFlyer.validFrom} - {currentFlyer.validTo}
        </Text>
      </View>

      {/* Hint */}
      <View style={styles.hintContainer}>
        <Ionicons name="information-circle" size={18} color={colors.textLight} />
        <Text style={styles.hintText}>
          Tryck på ett erbjudande för att lägga till i inköpslistan
        </Text>
      </View>

      {/* Offers List grouped by category */}
      <ScrollView style={styles.offersContainer} contentContainerStyle={styles.offersContent}>
        {Object.entries(groupedOffers).map(([category, offers]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.categoryCount}>{offers.length} produkter</Text>
            </View>
            {offers.map((offer) => (
              <TouchableOpacity
                key={offer.id}
                style={styles.offerItem}
                onPress={() => handleAddToList(offer)}
              >
                <View style={styles.offerLeft}>
                  {offer.discount && (
                    <View style={[styles.offerBadge, { backgroundColor: currentFlyer.color }]}>
                      <Text style={styles.offerBadgeText}>{offer.discount}</Text>
                    </View>
                  )}
                  <View style={styles.offerTextContainer}>
                    <Text style={styles.offerName} numberOfLines={2}>{offer.name}</Text>
                    <Text style={styles.offerUnit}>{offer.unit}</Text>
                  </View>
                </View>
                <View style={styles.offerRight}>
                  <Text style={[styles.offerPrice, { color: currentFlyer.color }]}>{offer.price}</Text>
                  {offer.originalPrice && (
                    <Text style={styles.offerOriginalPrice}>{offer.originalPrice}</Text>
                  )}
                </View>
                <View style={[styles.addButton, { backgroundColor: currentFlyer.color }]}>
                  <Ionicons name="add" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  headerWeek: {
    fontSize: 12,
    color: colors.textLight,
  },
  storeSelector: {
    backgroundColor: colors.cardBackground,
    maxHeight: 90,
  },
  storeSelectorContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  storeButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 10,
    backgroundColor: colors.cardBackground,
    minWidth: 100,
  },
  storeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  storeOfferCount: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  validityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  validityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBackground,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hintText: {
    fontSize: 13,
    color: colors.textLight,
  },
  offersContainer: {
    flex: 1,
  },
  offersContent: {
    padding: 16,
    paddingBottom: 32,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  offerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  offerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  offerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  offerTextContainer: {
    flex: 1,
  },
  offerName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  offerUnit: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  offerRight: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  offerOriginalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
