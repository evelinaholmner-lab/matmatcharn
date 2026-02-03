import React, { useState, useRef, useCallback } from 'react';
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
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './utils/colors';
import { useAppStore } from './store';
import { Store, IngredientCategory } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FlyerOffer {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  unit?: string;
  category: IngredientCategory;
  x?: number;
  y?: number;
}

interface FlyerPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
  thumbnailUrl: string;
  offers: FlyerOffer[];
}

interface StoreFlyer {
  store: Store;
  storeName: string;
  logoUrl: string;
  color: string;
  validFrom: string;
  validTo: string;
  weekNumber: number;
  totalPages: number;
  pages: FlyerPage[];
}

// Riktiga reklambladsdata från kampanjveckan.se
const storeFlyers: StoreFlyer[] = [
  {
    store: 'ICA',
    storeName: 'ICA Supermarket',
    logoUrl: 'https://static.kampanjveckan.se/logos/ICA%20Supermarket.png',
    color: '#E3000F',
    validFrom: '2/2',
    validTo: '8/2',
    weekNumber: 6,
    totalPages: 10,
    pages: [
      { 
        id: 'ica-1', 
        pageNumber: 1,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35029/ICASupermarket062026-1_zoom-0.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35029/popup_40940.jpg.0',
        offers: [
          { id: 'ica-o1', name: 'Riven Cheddar & Mozzarella', price: '20 kr', originalPrice: '30 kr', discount: '-35%', unit: '150g', category: 'Mejeri' },
          { id: 'ica-o2', name: 'Pasta ICA', price: '10 kr', originalPrice: '15 kr', discount: '-33%', unit: '500g', category: 'Torrvaror' },
        ]
      },
      { 
        id: 'ica-2', 
        pageNumber: 2,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35029/ICASupermarket062026-1_zoom-1.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35029/popup_40940.jpg.1',
        offers: [
          { id: 'ica-o3', name: 'Tomater', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: 'förp', category: 'Frukt & Grönt' },
          { id: 'ica-o4', name: 'Päron', price: '15 kr', originalPrice: '25 kr', discount: '-40%', unit: 'kg', category: 'Frukt & Grönt' },
        ]
      },
      { 
        id: 'ica-3', 
        pageNumber: 3,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35029/ICASupermarket062026-1_zoom-2.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35029/popup_40940.jpg.2',
        offers: [
          { id: 'ica-o5', name: 'Oatly iKaffe', price: '2 för 30 kr', originalPrice: '19,90 kr/st', discount: '-25%', unit: '1L', category: 'Mejeri' },
          { id: 'ica-o6', name: 'Mogen Mango', price: '2 för 25 kr', originalPrice: '15 kr/st', discount: '-35%', unit: 'st', category: 'Frukt & Grönt' },
        ]
      },
      { 
        id: 'ica-4', 
        pageNumber: 4,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35029/ICASupermarket062026-1_zoom-3.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35029/popup_40940.jpg.3',
        offers: [
          { id: 'ica-o7', name: 'Ägg ICA', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: '12-pack', category: 'Mejeri' },
        ]
      },
      { 
        id: 'ica-5', 
        pageNumber: 5,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35029/ICASupermarket062026-1_zoom-4.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35029/popup_40940.jpg.4',
        offers: []
      },
    ]
  },
  {
    store: 'Coop',
    storeName: 'Coop',
    logoUrl: 'https://static.kampanjveckan.se/logos/Coop.png',
    color: '#00A94F',
    validFrom: '2/2',
    validTo: '8/2',
    weekNumber: 6,
    totalPages: 8,
    pages: [
      { 
        id: 'coop-1', 
        pageNumber: 1,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35048/Coop062026-1_zoom-0.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35048/popup_40960.jpg.0',
        offers: [
          { id: 'coop-o1', name: 'Arla Yoghurt', price: '2 för 35 kr', originalPrice: '22 kr/st', discount: '-20%', unit: '1kg', category: 'Mejeri' },
          { id: 'coop-o2', name: 'Apelsiner', price: '17 kr', originalPrice: '29 kr', discount: '-40%', unit: 'kg', category: 'Frukt & Grönt' },
        ]
      },
      { 
        id: 'coop-2', 
        pageNumber: 2,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35048/Coop062026-1_zoom-1.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35048/popup_40960.jpg.1',
        offers: [
          { id: 'coop-o3', name: 'Scan Baconskivor', price: '39,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '420g', category: 'Kött & Fågel' },
          { id: 'coop-o4', name: 'Sport Knäckebröd', price: '2 för 39 kr', originalPrice: '25 kr/st', discount: '-22%', unit: '550g', category: 'Bröd' },
        ]
      },
      { 
        id: 'coop-3', 
        pageNumber: 3,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35048/Coop062026-1_zoom-2.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35048/popup_40960.jpg.2',
        offers: [
          { id: 'coop-o5', name: 'Skogaholmslimpa', price: '22,90 kr', originalPrice: '30 kr', discount: '-25%', unit: '775g', category: 'Bröd' },
          { id: 'coop-o6', name: 'Oatly iKaffe', price: '2 för 35 kr', originalPrice: '22 kr/st', discount: '-20%', unit: '1L', category: 'Mejeri' },
        ]
      },
      { 
        id: 'coop-4', 
        pageNumber: 4,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35048/Coop062026-1_zoom-3.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35048/popup_40960.jpg.3',
        offers: []
      },
    ]
  },
  {
    store: 'Willys',
    storeName: 'Willys',
    logoUrl: 'https://static.kampanjveckan.se/logos/WILLY:S.png',
    color: '#FF6B00',
    validFrom: '2/2',
    validTo: '8/2',
    weekNumber: 6,
    totalPages: 12,
    pages: [
      { 
        id: 'willys-1', 
        pageNumber: 1,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35030/WILLYS062026-1_zoom-0.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35030/popup_40941.jpg.0',
        offers: [
          { id: 'willys-o1', name: 'Gouda Familjefavoriter', price: '79,90 kr', originalPrice: '109 kr', discount: '-30%', unit: 'kg', category: 'Mejeri' },
          { id: 'willys-o2', name: 'Falukorv Garant', price: '19,90 kr', originalPrice: '35,90 kr', discount: '-45%', unit: '800g', category: 'Kött & Fågel' },
        ]
      },
      { 
        id: 'willys-2', 
        pageNumber: 2,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35030/WILLYS062026-1_zoom-1.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35030/popup_40941.jpg.1',
        offers: [
          { id: 'willys-o3', name: 'Högrev Nötkött', price: '118 kr', originalPrice: '165 kr', discount: '-30%', unit: 'kg', category: 'Kött & Fågel' },
          { id: 'willys-o4', name: 'Vitkål Import', price: '4,90 kr', originalPrice: '12,90 kr', discount: '-60%', unit: 'kg', category: 'Frukt & Grönt' },
        ]
      },
      { 
        id: 'willys-3', 
        pageNumber: 3,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35030/WILLYS062026-1_zoom-2.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35030/popup_40941.jpg.2',
        offers: [
          { id: 'willys-o5', name: 'Kokosgrädde Garant', price: '2 för 24 kr', originalPrice: '14,90 kr/st', discount: '-20%', unit: '250ml', category: 'Mejeri' },
          { id: 'willys-o6', name: 'Daloon Vårrullar', price: '29,90 kr', originalPrice: '47,90 kr', discount: '-40%', unit: '800g', category: 'Övrigt' },
        ]
      },
      { 
        id: 'willys-4', 
        pageNumber: 4,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35030/WILLYS062026-1_zoom-3.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35030/popup_40941.jpg.3',
        offers: [
          { id: 'willys-o7', name: 'Rice Noodles', price: '17,90 kr', discount: '-15%', unit: '180g', category: 'Torrvaror' },
          { id: 'willys-o8', name: 'Pepsi Max Flak', price: '79,90 kr', originalPrice: '119 kr', discount: '-33%', unit: '20x33cl', category: 'Övrigt' },
        ]
      },
    ]
  },
  {
    store: 'Lidl',
    storeName: 'Lidl',
    logoUrl: 'https://static.kampanjveckan.se/logos/Lidl.png',
    color: '#0050AA',
    validFrom: '2/2',
    validTo: '8/2',
    weekNumber: 6,
    totalPages: 24,
    pages: [
      { 
        id: 'lidl-1', 
        pageNumber: 1,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35009/Lidl062026-1_zoom-0.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35009/popup_40917.jpg.0',
        offers: [
          { id: 'lidl-o1', name: 'Gul Lök', price: '5,90 kr', originalPrice: '11,90 kr', discount: '-50%', unit: 'kg', category: 'Frukt & Grönt' },
        ]
      },
      { 
        id: 'lidl-2', 
        pageNumber: 2,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35009/Lidl062026-1_zoom-1.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35009/popup_40917.jpg.1',
        offers: [
          { id: 'lidl-o2', name: 'Ananas', price: '16,90 kr', originalPrice: '27,90 kr', discount: '-40%', unit: 'st', category: 'Frukt & Grönt' },
          { id: 'lidl-o3', name: 'Päron', price: '17,90 kr', originalPrice: '27 kr', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
          { id: 'lidl-o4', name: 'Jordgubbar', price: '39,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '400g', category: 'Frukt & Grönt' },
        ]
      },
      { 
        id: 'lidl-3', 
        pageNumber: 3,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35009/Lidl062026-1_zoom-2.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35009/popup_40917.jpg.2',
        offers: [
          { id: 'lidl-o5', name: 'Kronfågel Kycklinglårfilé', price: '119 kr', originalPrice: '169 kr', discount: '-30%', unit: 'kg', category: 'Kött & Fågel' },
          { id: 'lidl-o6', name: 'Marinerad Kycklingfilé', price: '99 kr', originalPrice: '149 kr', discount: '-35%', unit: 'förp', category: 'Kött & Fågel' },
          { id: 'lidl-o7', name: 'Pulled Pork', price: '49,90 kr', originalPrice: '69,90 kr', discount: '-30%', unit: 'förp', category: 'Kött & Fågel' },
        ]
      },
      { 
        id: 'lidl-4', 
        pageNumber: 4,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35009/Lidl062026-1_zoom-3.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35009/popup_40917.jpg.3',
        offers: [
          { id: 'lidl-o8', name: 'Gravad/Kallrökt Lax', price: '109 kr', originalPrice: '139 kr', discount: '-22%', unit: 'förp', category: 'Fisk & Skaldjur' },
        ]
      },
      { 
        id: 'lidl-5', 
        pageNumber: 5,
        imageUrl: 'https://static.kampanjveckan.se/1st-retail-sverige/2026/6/35009/Lidl062026-1_zoom-4.jpg',
        thumbnailUrl: 'https://static.kampanjveckan.se/thumb/1st-retail-sverige/2026/6/35009/popup_40917.jpg.4',
        offers: []
      },
    ]
  },
];

export default function FlyersScreen() {
  const router = useRouter();
  const { addManualItem } = useAppStore();
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showOffersList, setShowOffersList] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const currentFlyer = storeFlyers[selectedStoreIndex];
  const currentPage = currentFlyer.pages[currentPageIndex];

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

  const goToPage = useCallback((index: number) => {
    setCurrentPageIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setShowThumbnails(false);
  }, []);

  const handleScroll = useCallback((event: any) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (pageIndex !== currentPageIndex && pageIndex >= 0 && pageIndex < currentFlyer.pages.length) {
      setCurrentPageIndex(pageIndex);
    }
  }, [currentPageIndex, currentFlyer.pages.length]);

  const renderFlyerPage = useCallback(({ item }: { item: FlyerPage }) => (
    <View style={styles.pageContainer}>
      {imageLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentFlyer.color} />
        </View>
      )}
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.flyerImage}
        resizeMode="contain"
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
      />
    </View>
  ), [currentFlyer.color, imageLoading]);

  const renderThumbnail = useCallback(({ item, index }: { item: FlyerPage; index: number }) => (
    <TouchableOpacity
      style={[
        styles.thumbnail,
        currentPageIndex === index && { borderColor: currentFlyer.color, borderWidth: 3 }
      ]}
      onPress={() => goToPage(index)}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.thumbnailImage}
        resizeMode="cover"
      />
      <View style={[styles.thumbnailNumber, { backgroundColor: currentFlyer.color }]}>
        <Text style={styles.thumbnailNumberText}>{item.pageNumber}</Text>
      </View>
    </TouchableOpacity>
  ), [currentPageIndex, currentFlyer.color, goToPage]);

  const renderOfferItem = useCallback(({ item }: { item: FlyerOffer }) => (
    <TouchableOpacity
      style={styles.offerItem}
      onPress={() => handleAddToList(item)}
    >
      <View style={styles.offerInfo}>
        {item.discount && (
          <View style={[styles.offerBadge, { backgroundColor: currentFlyer.color }]}>
            <Text style={styles.offerBadgeText}>{item.discount}</Text>
          </View>
        )}
        <View style={styles.offerTextContainer}>
          <Text style={styles.offerName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.offerCategory}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.offerPriceContainer}>
        <Text style={[styles.offerPrice, { color: currentFlyer.color }]}>{item.price}</Text>
        {item.originalPrice && (
          <Text style={styles.offerOriginalPrice}>{item.originalPrice}</Text>
        )}
      </View>
      <View style={[styles.addIcon, { backgroundColor: currentFlyer.color }]}>
        <Ionicons name="add" size={18} color="#fff" />
      </View>
    </TouchableOpacity>
  ), [currentFlyer.color, handleAddToList]);

  // Alla erbjudanden från alla sidor
  const allOffers = currentFlyer.pages.flatMap(page => page.offers);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Reklamblad</Text>
          <Text style={styles.headerWeek}>Vecka {currentFlyer.weekNumber}</Text>
        </View>

        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => setShowOffersList(!showOffersList)}
        >
          <Ionicons name={showOffersList ? "newspaper" : "list"} size={24} color={colors.text} />
        </TouchableOpacity>
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
            onPress={() => {
              setSelectedStoreIndex(index);
              setCurrentPageIndex(0);
              flatListRef.current?.scrollToIndex({ index: 0, animated: false });
            }}
          >
            <Image 
              source={{ uri: flyer.logoUrl }} 
              style={styles.storeLogo}
              resizeMode="contain"
            />
            <Text style={[
              styles.storeButtonText,
              selectedStoreIndex === index && { color: flyer.color, fontWeight: '700' }
            ]}>
              {flyer.store}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Validity Banner */}
      <View style={[styles.validityBanner, { backgroundColor: currentFlyer.color }]}>
        <Ionicons name="calendar-outline" size={16} color="#fff" />
        <Text style={styles.validityText}>
          Gäller {currentFlyer.validFrom} - {currentFlyer.validTo} • {currentFlyer.totalPages} sidor
        </Text>
      </View>

      {showOffersList ? (
        /* Offers List View */
        <View style={styles.offersListContainer}>
          <View style={styles.offersListHeader}>
            <Text style={styles.offersListTitle}>
              {allOffers.length} erbjudanden
            </Text>
            <Text style={styles.offersListHint}>
              Tryck på ett erbjudande för att lägga till i listan
            </Text>
          </View>
          <FlatList
            data={allOffers}
            renderItem={renderOfferItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.offersListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
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
            onMomentumScrollEnd={handleScroll}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />

          {/* Page Indicator */}
          <View style={styles.pageIndicatorContainer}>
            <TouchableOpacity 
              style={styles.thumbnailsButton}
              onPress={() => setShowThumbnails(true)}
            >
              <Ionicons name="grid-outline" size={18} color={colors.text} />
              <Text style={styles.pageIndicatorText}>
                {currentPageIndex + 1} / {currentFlyer.pages.length}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Arrows */}
          {currentPageIndex > 0 && (
            <TouchableOpacity 
              style={[styles.navArrow, styles.navArrowLeft]}
              onPress={() => goToPage(currentPageIndex - 1)}
            >
              <Ionicons name="chevron-back" size={28} color={colors.text} />
            </TouchableOpacity>
          )}
          {currentPageIndex < currentFlyer.pages.length - 1 && (
            <TouchableOpacity 
              style={[styles.navArrow, styles.navArrowRight]}
              onPress={() => goToPage(currentPageIndex + 1)}
            >
              <Ionicons name="chevron-forward" size={28} color={colors.text} />
            </TouchableOpacity>
          )}

          {/* Current Page Offers */}
          {currentPage.offers.length > 0 && (
            <View style={styles.currentOffersContainer}>
              <Text style={styles.currentOffersTitle}>
                Erbjudanden på denna sida
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {currentPage.offers.map((offer) => (
                  <TouchableOpacity
                    key={offer.id}
                    style={[styles.quickOfferCard, { borderColor: currentFlyer.color }]}
                    onPress={() => handleAddToList(offer)}
                  >
                    {offer.discount && (
                      <View style={[styles.quickOfferBadge, { backgroundColor: currentFlyer.color }]}>
                        <Text style={styles.quickOfferBadgeText}>{offer.discount}</Text>
                      </View>
                    )}
                    <Text style={styles.quickOfferName} numberOfLines={1}>{offer.name}</Text>
                    <Text style={[styles.quickOfferPrice, { color: currentFlyer.color }]}>{offer.price}</Text>
                    <Ionicons name="add-circle" size={20} color={currentFlyer.color} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Thumbnails Modal */}
      <Modal
        visible={showThumbnails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowThumbnails(false)}
      >
        <View style={styles.thumbnailsModal}>
          <View style={styles.thumbnailsContent}>
            <View style={styles.thumbnailsHeader}>
              <Text style={styles.thumbnailsTitle}>Sidöversikt</Text>
              <TouchableOpacity onPress={() => setShowThumbnails(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currentFlyer.pages}
              renderItem={renderThumbnail}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={styles.thumbnailsGrid}
              columnWrapperStyle={styles.thumbnailsRow}
            />
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
    maxHeight: 70,
  },
  storeSelectorContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8,
    backgroundColor: colors.cardBackground,
  },
  storeLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  storeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  validityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  validityText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  flyerContainer: {
    flex: 1,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  flyerImage: {
    width: SCREEN_WIDTH - 16,
    height: '100%',
    borderRadius: 8,
  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  thumbnailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  pageIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  navArrow: {
    position: 'absolute',
    top: '40%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  navArrowLeft: {
    left: 8,
  },
  navArrowRight: {
    right: 8,
  },
  currentOffersContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  currentOffersTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
    marginLeft: 16,
    marginBottom: 10,
  },
  quickOfferCard: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    minWidth: 120,
  },
  quickOfferBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  quickOfferBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  quickOfferName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickOfferPrice: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  // Thumbnails Modal
  thumbnailsModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  thumbnailsContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  thumbnailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumbnailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  thumbnailsGrid: {
    padding: 12,
  },
  thumbnailsRow: {
    justifyContent: 'flex-start',
    gap: 12,
  },
  thumbnail: {
    width: (SCREEN_WIDTH - 60) / 3,
    aspectRatio: 0.7,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 12,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailNumber: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  // Offers List View
  offersListContainer: {
    flex: 1,
  },
  offersListHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  offersListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  offersListHint: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  offersListContent: {
    padding: 12,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  offerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  offerBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  offerTextContainer: {
    flex: 1,
  },
  offerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  offerCategory: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  offerPriceContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  offerOriginalPrice: {
    fontSize: 11,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
