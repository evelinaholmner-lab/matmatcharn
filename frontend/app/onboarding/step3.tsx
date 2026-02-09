import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../utils/colors';
import { useAppStore } from '../store';
import { DietaryPreference, Allergen } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { findNearbyStores, StoreLocation } from '../data/stores';

const STORE_COLORS: Record<string, string> = {
  'ICA': '#E3000F',
  'Coop': '#00A94F',
  'Willys': '#FF6B00',
  'Lidl': '#0050AA',
};

export default function OnboardingStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setUserProfile } = useAppStore();
  
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [nearbyStores, setNearbyStores] = useState<Array<StoreLocation & { distance: number }>>([]);
  const [allStores, setAllStores] = useState<Array<StoreLocation & { distance: number }>>([]);
  const [showAllStores, setShowAllStores] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hitta närliggande butiker när komponenten laddar
  useEffect(() => {
    const userLat = parseFloat(params.userLat as string);
    const userLng = parseFloat(params.userLng as string);
    const nearby = findNearbyStores(userLat, userLng, 15); // 15 km radie
    const all = findNearbyStores(userLat, userLng, 100); // Alla butiker inom 100 km
    
    setNearbyStores(nearby);
    setAllStores(all);
    
    // Förvald de 2 närmaste butikerna
    if (nearby.length > 0) {
      setSelectedStores([nearby[0].name, nearby.length > 1 ? nearby[1].name : nearby[0].name]);
    }
  }, [params.userLat, params.userLng]);

  const toggleStore = (storeName: string) => {
    setSelectedStores(prev => {
      if (prev.includes(storeName)) {
        // Minst en butik måste vara vald
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== storeName);
      }
      return [...prev, storeName];
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleFinish = async () => {
    if (selectedStores.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const numberOfPeople = parseInt(params.numberOfPeople as string) || 2;
    const dietaryPreference = params.dietaryPreference as DietaryPreference || 'allatare';
    const allergies = params.allergies ? JSON.parse(params.allergies as string) as Allergen[] : [];
    const address = params.address as string;

    // Konvertera specifika butiksnamn till kategorier för kampanjer
    const storeCategories = selectedStores.map(storeName => {
      const store = [...nearbyStores, ...allStores].find(s => s.name === storeName);
      return store?.category;
    }).filter((cat): cat is 'ICA' | 'Coop' | 'Willys' | 'Lidl' => cat !== undefined);

    // Ta bort dubbletter
    const uniqueStores = [...new Set(storeCategories)];

    const profile = {
      numberOfPeople,
      dietaryPreference,
      allergies,
      location: address,
      selectedStores: uniqueStores,
      onboardingCompleted: true,
    };

    await setUserProfile(profile);
    
    // Navigera till AI-genererad veckomeny
    router.replace('/generated-menu');
  };

  const displayedStores = showAllStores ? allStores : nearbyStores;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Välj butiker</Text>
          <Text style={styles.subtitle}>Vilka butiker vill du bevaka kampanjer hos?</Text>
        </View>

        {/* Sammanfattning av preferenser */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="people" size={18} color={colors.primary} />
            <Text style={styles.summaryText}>{params.numberOfPeople || 2} personer</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="restaurant" size={18} color={colors.primary} />
            <Text style={styles.summaryText}>
              {params.dietaryPreference === 'pescetariansk' ? 'Pescetarian' : 
               params.dietaryPreference === 'flexitariansk' ? 'Flexitarian' : 'Allätare'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="location" size={18} color={colors.primary} />
            <Text style={styles.summaryText}>{params.city || 'Umeå'}</Text>
          </View>
        </Card>

        {/* Butiker */}
        <Card>
          <View style={styles.storeHeader}>
            <Text style={styles.sectionTitle}>
              {showAllStores ? 'Alla butiker' : 'Butiker nära dig'}
            </Text>
            <Text style={styles.storeCount}>
              {displayedStores.length} butiker
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.toggleAllButton}
            onPress={() => setShowAllStores(!showAllStores)}
          >
            <Ionicons 
              name={showAllStores ? "location" : "globe"} 
              size={18} 
              color={colors.primary} 
            />
            <Text style={styles.toggleAllText}>
              {showAllStores ? 'Visa endast närliggande' : 'Se alla butiker'}
            </Text>
          </TouchableOpacity>

          <View style={styles.storeList}>
            {displayedStores.map((store) => (
              <TouchableOpacity
                key={store.name}
                style={[
                  styles.storeItem,
                  selectedStores.includes(store.name) && styles.storeItemSelected,
                  { borderLeftColor: STORE_COLORS[store.category] }
                ]}
                onPress={() => toggleStore(store.name)}
              >
                <View style={styles.storeInfo}>
                  <View style={[styles.storeIcon, { backgroundColor: STORE_COLORS[store.category] + '20' }]}>
                    <Ionicons name="storefront" size={18} color={STORE_COLORS[store.category]} />
                  </View>
                  <View style={styles.storeDetails}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeAddress}>{store.address}</Text>
                  </View>
                </View>
                <View style={styles.storeRight}>
                  <Text style={styles.storeDistance}>{store.distance.toFixed(1)} km</Text>
                  {selectedStores.includes(store.name) && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Valda butiker */}
        {selectedStores.length > 0 && (
          <Card style={styles.selectedCard}>
            <Text style={styles.selectedTitle}>Valda butiker ({selectedStores.length})</Text>
            <View style={styles.selectedChips}>
              {selectedStores.map(storeName => {
                const store = [...nearbyStores, ...allStores].find(s => s.name === storeName);
                return (
                  <View 
                    key={storeName}
                    style={[styles.selectedChip, { backgroundColor: STORE_COLORS[store?.category || 'ICA'] + '20' }]}
                  >
                    <Text style={[styles.selectedChipText, { color: STORE_COLORS[store?.category || 'ICA'] }]}>
                      {store?.category}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        <Button 
          title={isSubmitting ? "Laddar..." : "Visa kampanjer"} 
          onPress={handleFinish}
          disabled={selectedStores.length === 0 || isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 140,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
  },
  summaryCard: {
    backgroundColor: colors.primaryLight + '10',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  toggleAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    padding: 10,
    backgroundColor: colors.primaryLight + '15',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  toggleAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  storeList: {
    gap: 10,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderLeftWidth: 4,
    backgroundColor: colors.background,
  },
  storeItemSelected: {
    backgroundColor: colors.success + '08',
    borderColor: colors.success,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  storeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  storeAddress: {
    fontSize: 12,
    color: colors.textLight,
  },
  storeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeDistance: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  selectedCard: {
    marginTop: 16,
    backgroundColor: colors.success + '10',
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
});
