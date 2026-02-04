import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from './store';
import { Card } from './components/Card';
import { colors } from './utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { Campaign, Store, IngredientCategory } from './types';

// Kategorifärger
const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  'Mejeri': '#FFE082',
  'Kött & Fågel': '#EF9A9A',
  'Fisk & Skaldjur': '#81D4FA',
  'Frukt & Grönt': '#A5D6A7',
  'Torrvaror': '#BCAAA4',
  'Bröd': '#D7CCC8',
  'Kryddor & Såser': '#CE93D8',
  'Drycker': '#90CAF9',
  'Övrigt': '#B0BEC5',
};

const STORE_COLORS: Record<Store, string> = {
  'ICA': '#E3000F',
  'Coop': '#00A94F',
  'Willys': '#FF6B00',
  'Lidl': '#0050AA',
};

// Måltidsförslag som kan skapas baserat på kategori
interface MealSuggestion {
  id: string;
  title: string;
  description: string;
  mainIngredient: Campaign;
  category: 'Kött' | 'Fisk' | 'Vegetariskt' | 'Frukost' | 'Mellanmål';
  icon: string;
}

export default function WeeklyPlan() {
  const router = useRouter();
  const { userProfile, getFilteredCampaigns, generateShoppingList } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);

  // Generera måltidsförslag baserat på kampanjer
  const generateSuggestions = () => {
    if (!userProfile) return;
    
    const campaigns = getFilteredCampaigns();
    const newSuggestions: MealSuggestion[] = [];
    
    // Sortera kampanjer efter rabatt (högst först = billigast)
    const sortedCampaigns = [...campaigns].sort((a, b) => b.discount - a.discount);
    
    // Hitta proteinkällor
    const proteins = sortedCampaigns.filter(c => {
      const name = c.ingredient.toLowerCase();
      return ['kyckling', 'fläsk', 'nöt', 'färs', 'korv', 'bacon', 'lax', 'torsk', 'fisk', 'räk', 'pulled'].some(k => name.includes(k));
    });
    
    // Hitta kolhydrater
    const carbs = sortedCampaigns.filter(c => {
      const name = c.ingredient.toLowerCase();
      return ['pasta', 'ris', 'potatis', 'bröd', 'nudlar', 'tortilla'].some(k => name.includes(k));
    });
    
    // Hitta grönsaker
    const veggies = sortedCampaigns.filter(c => {
      const name = c.ingredient.toLowerCase();
      return ['tomat', 'lök', 'paprika', 'broccoli', 'morot', 'spenat', 'sallad', 'gurka', 'champinjon', 'kål', 'selleri'].some(k => name.includes(k));
    });
    
    // Hitta frukt
    const fruits = sortedCampaigns.filter(c => {
      const name = c.ingredient.toLowerCase();
      return ['äpple', 'päron', 'banan', 'mango', 'ananas', 'jordgubb', 'blåbär', 'hallon', 'apelsin', 'kiwi'].some(k => name.includes(k));
    });
    
    // Hitta mejeri för frukost
    const dairy = sortedCampaigns.filter(c => {
      const name = c.ingredient.toLowerCase();
      return ['yoghurt', 'mjölk', 'fil', 'ägg', 'ost'].some(k => name.includes(k));
    });
    
    // Skapa måltidsförslag baserat på billigaste råvarorna
    let suggestionId = 0;
    
    // Köttbaserade måltider
    const meatProteins = proteins.filter(p => {
      const name = p.ingredient.toLowerCase();
      return ['kyckling', 'fläsk', 'nöt', 'färs', 'korv', 'bacon', 'pulled'].some(k => name.includes(k));
    });
    
    meatProteins.slice(0, 3).forEach(protein => {
      const name = protein.ingredient.toLowerCase();
      let suggestion: MealSuggestion | null = null;
      
      if (name.includes('kyckling')) {
        const carb = carbs.find(c => c.ingredient.toLowerCase().includes('ris')) || carbs[0];
        const veggie = veggies[0];
        suggestion = {
          id: `suggestion-${suggestionId++}`,
          title: `${protein.ingredient} med ${carb?.ingredient || 'ris'}`,
          description: veggie ? `Servera med ${veggie.ingredient.toLowerCase()}` : 'Enkel vardagsrätt',
          mainIngredient: protein,
          category: 'Kött',
          icon: 'restaurant',
        };
      } else if (name.includes('färs') || name.includes('nöt')) {
        const carb = carbs.find(c => c.ingredient.toLowerCase().includes('pasta')) || carbs[0];
        suggestion = {
          id: `suggestion-${suggestionId++}`,
          title: `Köttfärssås med ${carb?.ingredient || 'pasta'}`,
          description: 'Klassisk husmanskost',
          mainIngredient: protein,
          category: 'Kött',
          icon: 'restaurant',
        };
      } else if (name.includes('falukorv') || name.includes('korv')) {
        suggestion = {
          id: `suggestion-${suggestionId++}`,
          title: `Stekt ${protein.ingredient}`,
          description: 'Med stuvade makaroner eller potatis',
          mainIngredient: protein,
          category: 'Kött',
          icon: 'restaurant',
        };
      } else if (name.includes('fläsk') || name.includes('pulled')) {
        suggestion = {
          id: `suggestion-${suggestionId++}`,
          title: `${protein.ingredient}`,
          description: carbs.find(c => c.ingredient.toLowerCase().includes('tortilla')) 
            ? 'Servera i tortillabröd' 
            : 'Med kokt potatis och sås',
          mainIngredient: protein,
          category: 'Kött',
          icon: 'restaurant',
        };
      } else if (name.includes('bacon')) {
        suggestion = {
          id: `suggestion-${suggestionId++}`,
          title: `Pasta carbonara med ${protein.ingredient}`,
          description: 'Krämig pastarätt',
          mainIngredient: protein,
          category: 'Kött',
          icon: 'restaurant',
        };
      }
      
      if (suggestion) {
        newSuggestions.push(suggestion);
      }
    });
    
    // Fiskbaserade måltider
    const fishProteins = proteins.filter(p => {
      const name = p.ingredient.toLowerCase();
      return ['lax', 'torsk', 'fisk', 'räk', 'sej', 'sill'].some(k => name.includes(k));
    });
    
    fishProteins.slice(0, 2).forEach(protein => {
      const name = protein.ingredient.toLowerCase();
      let suggestion: MealSuggestion | null = null;
      
      if (name.includes('lax')) {
        suggestion = {
          id: `suggestion-${suggestionId++}`,
          title: `Ugnsbakad ${protein.ingredient}`,
          description: 'Med kokt potatis och dillsås',
          mainIngredient: protein,
          category: 'Fisk',
          icon: 'fish',
        };
      } else if (name.includes('torsk')) {
        suggestion = {
          id: `suggestion-${suggestionId++}`,
          title: `Stekt ${protein.ingredient}`,
          description: 'Med äggsås och kokt potatis',
          mainIngredient: protein,
          category: 'Fisk',
          icon: 'fish',
        };
      } else if (name.includes('räk')) {
        suggestion = {
          id: `suggestion-${suggestionId++}`,
          title: `${protein.ingredient}pasta`,
          description: 'Krämig pasta med citron',
          mainIngredient: protein,
          category: 'Fisk',
          icon: 'fish',
        };
      }
      
      if (suggestion) {
        newSuggestions.push(suggestion);
      }
    });
    
    // Vegetariska förslag
    if (veggies.length > 0) {
      const mainVeggie = veggies[0];
      const carb = carbs[0];
      newSuggestions.push({
        id: `suggestion-${suggestionId++}`,
        title: `Ugnsrostade grönsaker`,
        description: `Med ${mainVeggie.ingredient.toLowerCase()}${carb ? ` och ${carb.ingredient.toLowerCase()}` : ''}`,
        mainIngredient: mainVeggie,
        category: 'Vegetariskt',
        icon: 'leaf',
      });
    }
    
    // Frukostförslag
    if (dairy.length > 0 || fruits.length > 0) {
      const mainIngredient = dairy[0] || fruits[0];
      newSuggestions.push({
        id: `suggestion-${suggestionId++}`,
        title: fruits.length > 0 ? `Frukosttallrik med ${fruits[0].ingredient.toLowerCase()}` : `${mainIngredient.ingredient} med müsli`,
        description: dairy.length > 0 && fruits.length > 0 
          ? `${dairy[0].ingredient} och färsk frukt` 
          : 'Perfekt start på dagen',
        mainIngredient: mainIngredient,
        category: 'Frukost',
        icon: 'sunny',
      });
    }
    
    // Mellanmålsförslag
    if (fruits.length > 1) {
      newSuggestions.push({
        id: `suggestion-${suggestionId++}`,
        title: `Fruktsallad`,
        description: `Med ${fruits.slice(0, 3).map(f => f.ingredient.toLowerCase()).join(', ')}`,
        mainIngredient: fruits[0],
        category: 'Mellanmål',
        icon: 'cafe',
      });
    }
    
    setSuggestions(newSuggestions);
  };

  useEffect(() => {
    generateSuggestions();
  }, [userProfile]);

  const handleRefresh = () => {
    setRefreshing(true);
    generateShoppingList();
    generateSuggestions();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Beräkna totalt sparande
  const totalDiscount = useMemo(() => {
    if (!userProfile) return 0;
    const campaigns = getFilteredCampaigns();
    return campaigns.reduce((sum, c) => sum + c.discount, 0);
  }, [userProfile, getFilteredCampaigns]);

  // Räkna antal kampanjer per butik
  const campaignsByStore = useMemo(() => {
    if (!userProfile) return {};
    const campaigns = getFilteredCampaigns();
    const byStore: Record<Store, number> = { ICA: 0, Coop: 0, Willys: 0, Lidl: 0 };
    campaigns.forEach(c => byStore[c.store]++);
    return byStore;
  }, [userProfile, getFilteredCampaigns]);

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>Slutför onboarding först</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Veckans Kampanjer</Text>
            <Text style={styles.headerSubtitle}>
              Förslag baserat på bästa priserna
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Butikskampanjer översikt */}
        <View style={styles.storeChips}>
          {userProfile.selectedStores.map(store => (
            <View 
              key={store}
              style={[styles.storeChip, { backgroundColor: STORE_COLORS[store] + '15' }]}
            >
              <View style={[styles.storeChipDot, { backgroundColor: STORE_COLORS[store] }]} />
              <Text style={[styles.storeChipText, { color: STORE_COLORS[store] }]}>
                {store}: {campaignsByStore[store] || 0} erbjudanden
              </Text>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/flyers')}
          >
            <Ionicons name="newspaper" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Reklamblad</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => router.push('/shopping-list')}
          >
            <Ionicons name="cart" size={20} color={colors.textInverse} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextInverse]}>
              Inköpslista
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Måltidsförslag */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Förslag header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Måltidsförslag</Text>
          <Text style={styles.sectionSubtitle}>
            Baserat på {getFilteredCampaigns().length} kampanjprodukter
          </Text>
        </View>

        {suggestions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="search-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyCardText}>
              Inga förslag tillgängliga just nu
            </Text>
            <Text style={styles.emptyCardSubtext}>
              Prova att välja fler butiker i profilen
            </Text>
          </Card>
        ) : (
          suggestions.map(suggestion => (
            <Card key={suggestion.id} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <View style={[
                  styles.suggestionIcon, 
                  { backgroundColor: STORE_COLORS[suggestion.mainIngredient.store] + '15' }
                ]}>
                  <Ionicons 
                    name={suggestion.icon as any} 
                    size={24} 
                    color={STORE_COLORS[suggestion.mainIngredient.store]} 
                  />
                </View>
                <View style={styles.suggestionInfo}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
                </View>
              </View>
              
              <View style={styles.suggestionFooter}>
                <View style={[
                  styles.storeBadge, 
                  { backgroundColor: STORE_COLORS[suggestion.mainIngredient.store] }
                ]}>
                  <Text style={styles.storeBadgeText}>{suggestion.mainIngredient.store}</Text>
                </View>
                <View style={styles.discountBadge}>
                  <Ionicons name="pricetag" size={14} color={colors.success} />
                  <Text style={styles.discountText}>
                    -{suggestion.mainIngredient.discount}% på {suggestion.mainIngredient.ingredient.toLowerCase()}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}

        {/* Alla kampanjprodukter */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Alla veckans erbjudanden</Text>
          <Text style={styles.sectionSubtitle}>
            Sorterat efter rabatt
          </Text>
        </View>

        <Card style={styles.campaignsCard}>
          {getFilteredCampaigns().slice(0, 15).map((campaign, index) => (
            <View 
              key={`${campaign.store}-${campaign.ingredient}-${index}`}
              style={[
                styles.campaignItem,
                index < getFilteredCampaigns().slice(0, 15).length - 1 && styles.campaignItemBorder
              ]}
            >
              <View style={[
                styles.campaignStoreDot, 
                { backgroundColor: STORE_COLORS[campaign.store] }
              ]} />
              <View style={styles.campaignInfo}>
                <Text style={styles.campaignIngredient}>{campaign.ingredient}</Text>
                <Text style={styles.campaignStore}>{campaign.store}</Text>
              </View>
              <View style={styles.campaignDiscount}>
                <Text style={styles.campaignDiscountText}>-{campaign.discount}%</Text>
              </View>
            </View>
          ))}
          
          {getFilteredCampaigns().length > 15 && (
            <TouchableOpacity 
              style={styles.showMoreButton}
              onPress={() => router.push('/flyers')}
            >
              <Text style={styles.showMoreText}>
                Se alla {getFilteredCampaigns().length} erbjudanden
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </TouchableOpacity>
          )}
        </Card>
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
    padding: 24,
    paddingBottom: 16,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  iconButton: {
    padding: 4,
  },
  storeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  storeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 6,
  },
  storeChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  storeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    gap: 8,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButtonTextInverse: {
    color: colors.textInverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
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
    marginVertical: 16,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyCardText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
    fontWeight: '600',
  },
  emptyCardSubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  suggestionCard: {
    marginBottom: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 12,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  suggestionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  storeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  storeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discountText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  campaignsCard: {
    paddingVertical: 0,
  },
  campaignItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  campaignItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  campaignStoreDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignIngredient: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  campaignStore: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  campaignDiscount: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  campaignDiscountText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
