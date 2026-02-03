import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  FlatList,
  Modal,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './utils/colors';
import { useAppStore } from './store';
import { Store, IngredientCategory } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Butikernas reklamblad data
interface FlyerPage {
  id: string;
  imageUrl: string;
  offers: FlyerOffer[];
}

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
  logo: string;
  color: string;
  validFrom: string;
  validTo: string;
  pages: FlyerPage[];
  offers: FlyerOffer[];
}

// Mock reklambladsdata baserat på riktiga erbjudanden
const storeFlyers: StoreFlyer[] = [
  {
    store: 'ICA',
    storeName: 'ICA Supermarket',
    logo: '🔴',
    color: '#E3000F',
    validFrom: '2 feb',
    validTo: '8 feb',
    pages: [
      { id: '1', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35029/ICASupermarket062026-1_zoom-0.jpg', offers: [] },
      { id: '2', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35029/ICASupermarket062026-1_zoom-1.jpg', offers: [] },
      { id: '3', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35029/ICASupermarket062026-1_zoom-2.jpg', offers: [] },
    ],
    offers: [
      { id: 'ica1', name: 'Riven Cheddar & Mozzarella', price: '20 kr', originalPrice: '30 kr', discount: '-35%', unit: '150g', category: 'Mejeri' },
      { id: 'ica2', name: 'Tomater', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: 'förp', category: 'Frukt & Grönt' },
      { id: 'ica3', name: 'Päron', price: '15 kr', originalPrice: '25 kr', discount: '-40%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'ica4', name: 'Oatly iKaffe', price: '2 för 30 kr', originalPrice: '19,90 kr/st', discount: '-25%', unit: '1L', category: 'Mejeri' },
      { id: 'ica5', name: 'Mogen Mango', price: '2 för 25 kr', originalPrice: '15 kr/st', discount: '-35%', unit: 'st', category: 'Frukt & Grönt' },
      { id: 'ica6', name: 'Ärtor, majs & paprika', price: '2 för 40 kr', originalPrice: '25 kr/st', discount: '-20%', unit: '600g', category: 'Frukt & Grönt' },
      { id: 'ica7', name: 'Pasta ICA', price: '10 kr', originalPrice: '15 kr', discount: '-33%', unit: '500g', category: 'Torrvaror' },
      { id: 'ica8', name: 'Ägg ICA', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: '12-pack', category: 'Mejeri' },
    ]
  },
  {
    store: 'Coop',
    storeName: 'Coop',
    logo: '🟢',
    color: '#00A94F',
    validFrom: '2 feb',
    validTo: '8 feb',
    pages: [
      { id: '1', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35048/Coop062026-1_zoom-0.jpg', offers: [] },
      { id: '2', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35048/Coop062026-1_zoom-1.jpg', offers: [] },
    ],
    offers: [
      { id: 'coop1', name: 'Arla Yoghurt', price: '2 för 35 kr', originalPrice: '22 kr/st', discount: '-20%', unit: '1kg', category: 'Mejeri' },
      { id: 'coop2', name: 'Apelsiner', price: '17 kr', originalPrice: '29 kr', discount: '-40%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'coop3', name: 'Scan Baconskivor', price: '39,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '420g', category: 'Kött & Fågel' },
      { id: 'coop4', name: 'Sport Knäckebröd', price: '2 för 39 kr', originalPrice: '25 kr/st', discount: '-22%', unit: '550g', category: 'Bröd' },
      { id: 'coop5', name: 'Skogaholmslimpa', price: '22,90 kr', originalPrice: '30 kr', discount: '-25%', unit: '775g', category: 'Bröd' },
      { id: 'coop6', name: 'Oatly iKaffe', price: '2 för 35 kr', originalPrice: '22 kr/st', discount: '-20%', unit: '1L', category: 'Mejeri' },
      { id: 'coop7', name: 'Nutella', price: '2 för 65 kr', originalPrice: '45 kr/st', discount: '-28%', unit: '350g', category: 'Kryddor & Såser' },
    ]
  },
  {
    store: 'Willys',
    storeName: 'Willys',
    logo: '🟠',
    color: '#FF6B00',
    validFrom: '2 feb',
    validTo: '8 feb',
    pages: [
      { id: '1', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35030/WILLYS062026-1_zoom-0.jpg', offers: [] },
      { id: '2', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35030/WILLYS062026-1_zoom-1.jpg', offers: [] },
    ],
    offers: [
      { id: 'willys1', name: 'Gouda Familjefavoriter', price: '79,90 kr', originalPrice: '109 kr', discount: '-30%', unit: 'kg', category: 'Mejeri' },
      { id: 'willys2', name: 'Falukorv Garant', price: '19,90 kr', originalPrice: '35,90 kr', discount: '-45%', unit: '800g', category: 'Kött & Fågel' },
      { id: 'willys3', name: 'Högrev Nötkött', price: '118 kr', originalPrice: '165 kr', discount: '-30%', unit: 'kg', category: 'Kött & Fågel' },
      { id: 'willys4', name: 'Vitkål Import', price: '4,90 kr', originalPrice: '12,90 kr', discount: '-60%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'willys5', name: 'Kokosgrädde Garant', price: '2 för 24 kr', originalPrice: '14,90 kr/st', discount: '-20%', unit: '250ml', category: 'Mejeri' },
      { id: 'willys6', name: 'Daloon Vårrullar', price: '29,90 kr', originalPrice: '47,90 kr', discount: '-40%', unit: '800g', category: 'Övrigt' },
      { id: 'willys7', name: 'Rice Noodles', price: '17,90 kr', originalPrice: '20,90 kr', discount: '-15%', unit: '180g', category: 'Torrvaror' },
      { id: 'willys8', name: 'Pepsi Max Flak', price: '79,90 kr', originalPrice: '119 kr', discount: '-33%', unit: '20x33cl', category: 'Övrigt' },
    ]
  },
  {
    store: 'Lidl',
    storeName: 'Lidl',
    logo: '🔵',
    color: '#0050AA',
    validFrom: '2 feb',
    validTo: '8 feb',
    pages: [
      { id: '1', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35009/Lidl062026-1_zoom-0.jpg', offers: [] },
      { id: '2', imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35009/Lidl062026-1_zoom-1.jpg', offers: [] },
    ],
    offers: [
      { id: 'lidl1', name: 'Gul Lök', price: '5,90 kr', originalPrice: '11,90 kr', discount: '-50%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'lidl2', name: 'Ananas', price: '16,90 kr', originalPrice: '27,90 kr', discount: '-40%', unit: 'st', category: 'Frukt & Grönt' },
      { id: 'lidl3', name: 'Päron', price: '17,90 kr', originalPrice: '27 kr', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
      { id: 'lidl4', name: 'Kronfågel Kycklinglårfilé', price: '119 kr', originalPrice: '169 kr', discount: '-30%', unit: 'kg', category: 'Kött & Fågel' },
      { id: 'lidl5', name: 'Marinerad Kycklingfilé', price: '99 kr', originalPrice: '149 kr', discount: '-35%', unit: 'förp', category: 'Kött & Fågel' },
      { id: 'lidl6', name: 'Gravad/Kallrökt Lax', price: '109 kr', originalPrice: '139 kr', discount: '-22%', unit: 'förp', category: 'Fisk & Skaldjur' },
      { id: 'lidl7', name: 'Pulled Pork', price: '49,90 kr', originalPrice: '69,90 kr', discount: '-30%', unit: 'förp', category: 'Kött & Fågel' },
      { id: 'lidl8', name: 'Jordgubbar', price: '39,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '400g', category: 'Frukt & Grönt' },
      { id: 'lidl9', name: 'Vitlök', price: '19,90 kr', originalPrice: '25 kr', discount: '-20%', unit: '250g', category: 'Frukt & Grönt' },
      { id: 'lidl10', name: 'Färsk Spenat', price: '24,90 kr', originalPrice: '35 kr', discount: '-30%', unit: '500g', category: 'Frukt & Grönt' },
    ]
  },
];

export default function FlyersScreen() {
  const router = useRouter();
  const { addManualItem, userProfile } = useAppStore();
  const [selectedStore, setSelectedStore] = useState<Store>('ICA');
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'flyer' | 'list'>('list');
  const [selectedOffer, setSelectedOffer] = useState<FlyerOffer | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const currentFlyer = storeFlyers.find(f => f.store === selectedStore)!;

  const handleAddToList = (offer: FlyerOffer) => {
    addManualItem({
      ingredient: offer.name,
      amount: 1,
      unit: 'st',
      category: offer.category
    });
    Alert.alert(
      '✅ Tillagd!',
      `${offer.name} har lagts till i din egna lista.`,
      [{ text: 'OK' }]
    );
  };

  const renderStoreTab = (flyer: StoreFlyer) => {
    const isSelected = selectedStore === flyer.store;
    return (
      <TouchableOpacity
        key={flyer.store}
        style={[
          styles.storeTab,
          isSelected && { borderBottomColor: flyer.color, borderBottomWidth: 3 }
        ]}
        onPress={() => {
          setSelectedStore(flyer.store);
          setCurrentPage(0);
        }}
      >
        <View style={[styles.storeLogo, { backgroundColor: flyer.color + '20' }]}>
          <Text style={styles.storeLogoText}>{flyer.logo}</Text>
        </View>
        <Text style={[
          styles.storeTabText,
          isSelected && { color: flyer.color, fontWeight: '700' }
        ]}>
          {flyer.store}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFlyerPage = ({ item, index }: { item: FlyerPage; index: number }) => (
    <View style={styles.flyerPageContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.flyerImage}
        resizeMode="contain"
      />
    </View>
  );

  const renderOfferCard = ({ item }: { item: FlyerOffer }) => (
    <TouchableOpacity
      style={styles.offerCard}
      onPress={() => setSelectedOffer(item)}
      activeOpacity={0.7}
    >
      <View style={styles.offerContent}>
        <View style={styles.offerHeader}>
          {item.discount && (
            <View style={[styles.discountBadge, { backgroundColor: currentFlyer.color }]}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>
          )}
          <Text style={styles.offerCategory}>{item.category}</Text>
        </View>
        
        <Text style={styles.offerName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.offerPrice, { color: currentFlyer.color }]}>{item.price}</Text>
          {item.unit && <Text style={styles.offerUnit}>/ {item.unit}</Text>}
        </View>
        
        {item.originalPrice && (
          <Text style={styles.originalPrice}>Ord. {item.originalPrice}</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: currentFlyer.color }]}
        onPress={() => handleAddToList(item)}
      >
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPageIndicator = () => (
    <View style={styles.pageIndicator}>
      {currentFlyer.pages.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.pageDot,
            currentPage === index && { backgroundColor: currentFlyer.color }
          ]}
          onPress={() => {
            setCurrentPage(index);
            flatListRef.current?.scrollToIndex({ index, animated: true });
          }}
        />
      ))}
    </View>
  );

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
          <Text style={styles.headerTitle}>Reklamblad</Text>
          <Text style={styles.headerSubtitle}>Vecka 6 • {currentFlyer.validFrom} - {currentFlyer.validTo}</Text>
        </View>

        <TouchableOpacity 
          style={styles.viewModeButton}
          onPress={() => setViewMode(viewMode === 'flyer' ? 'list' : 'flyer')}
        >
          <Ionicons 
            name={viewMode === 'flyer' ? 'list' : 'newspaper'} 
            size={24} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Store Tabs */}
      <View style={styles.storeTabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeTabsContent}
        >
          {storeFlyers.map(renderStoreTab)}
        </ScrollView>
      </View>

      {/* Store Info Banner */}
      <View style={[styles.storeBanner, { backgroundColor: currentFlyer.color + '10' }]}>
        <Text style={styles.storeLogoLarge}>{currentFlyer.logo}</Text>
        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, { color: currentFlyer.color }]}>
            {currentFlyer.storeName}
          </Text>
          <Text style={styles.storeValidity}>
            Gäller {currentFlyer.validFrom} - {currentFlyer.validTo}
          </Text>
        </View>
        <View style={[styles.offerCount, { backgroundColor: currentFlyer.color }]}>
          <Text style={styles.offerCountText}>{currentFlyer.offers.length}</Text>
          <Text style={styles.offerCountLabel}>erbjudanden</Text>
        </View>
      </View>

      {viewMode === 'flyer' ? (
        /* Flyer View */
        <View style={styles.flyerContainer}>
          <FlatList
            ref={flatListRef}
            data={currentFlyer.pages}
            renderItem={renderFlyerPage}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentPage(page);
            }}
          />
          {renderPageIndicator()}
          <Text style={styles.swipeHint}>
            <Ionicons name="swap-horizontal" size={16} /> Svep för att bläddra • {currentPage + 1} / {currentFlyer.pages.length}
          </Text>
        </View>
      ) : (
        /* List View */
        <FlatList
          data={currentFlyer.offers}
          renderItem={renderOfferCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.offersListContainer}
          numColumns={2}
          columnWrapperStyle={styles.offerRow}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              Klicka på + för att lägga till i din lista
            </Text>
          }
        />
      )}

      {/* Offer Detail Modal */}
      <Modal
        visible={selectedOffer !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOffer(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOffer && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedOffer.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedOffer(null)}>
                    <Ionicons name="close" size={28} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  {selectedOffer.discount && (
                    <View style={[styles.modalDiscountBadge, { backgroundColor: currentFlyer.color }]}>
                      <Text style={styles.modalDiscountText}>{selectedOffer.discount}</Text>
                    </View>
                  )}
                  
                  <Text style={[styles.modalPrice, { color: currentFlyer.color }]}>
                    {selectedOffer.price}
                  </Text>
                  
                  {selectedOffer.originalPrice && (
                    <Text style={styles.modalOriginalPrice}>
                      Ordinarie pris: {selectedOffer.originalPrice}
                    </Text>
                  )}
                  
                  <View style={styles.modalInfo}>
                    <Ionicons name="storefront" size={16} color={colors.textLight} />
                    <Text style={styles.modalInfoText}>{currentFlyer.storeName}</Text>
                  </View>
                  
                  <View style={styles.modalInfo}>
                    <Ionicons name="calendar" size={16} color={colors.textLight} />
                    <Text style={styles.modalInfoText}>
                      Gäller {currentFlyer.validFrom} - {currentFlyer.validTo}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.modalAddButton, { backgroundColor: currentFlyer.color }]}
                    onPress={() => {
                      handleAddToList(selectedOffer);
                      setSelectedOffer(null);
                    }}
                  >
                    <Ionicons name="cart" size={20} color="#fff" />
                    <Text style={styles.modalAddButtonText}>Lägg till i inköpslistan</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
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
  viewModeButton: {
    padding: 8,
  },
  storeTabsContainer: {
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  storeTabsContent: {
    paddingHorizontal: 8,
  },
  storeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  storeLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  storeLogoText: {
    fontSize: 14,
  },
  storeTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  storeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
  },
  storeLogoLarge: {
    fontSize: 32,
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
  },
  storeValidity: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  offerCount: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  offerCountText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  offerCountLabel: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.9,
  },
  flyerContainer: {
    flex: 1,
  },
  flyerPageContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  flyerImage: {
    width: SCREEN_WIDTH - 32,
    height: '100%',
    borderRadius: 12,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  swipeHint: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textLight,
    paddingBottom: 16,
  },
  offersListContainer: {
    padding: 16,
    paddingTop: 8,
  },
  listHeader: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  offerRow: {
    justifyContent: 'space-between',
  },
  offerCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  offerContent: {
    padding: 12,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  offerCategory: {
    fontSize: 11,
    color: colors.textLight,
  },
  offerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    minHeight: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  offerUnit: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 32,
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
    flex: 1,
    marginRight: 16,
  },
  modalBody: {
    padding: 24,
    alignItems: 'center',
  },
  modalDiscountBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalDiscountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalPrice: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalOriginalPrice: {
    fontSize: 16,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 24,
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalInfoText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  modalAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
    width: '100%',
  },
  modalAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
