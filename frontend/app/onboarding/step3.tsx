import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../utils/colors';
import { useAppStore } from '../store';
import { MealType, DietaryPreference, Allergen } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { findNearbyStores, StoreLocation } from '../data/stores';

const MEAL_TYPES: { label: string; value: MealType; icon: string }[] = [
  { label: 'Frukost', value: 'frukost', icon: 'sunny' },
  { label: 'Lunch', value: 'lunch', icon: 'restaurant' },
  { label: 'Middag', value: 'middag', icon: 'moon' },
  { label: 'Mellanmål', value: 'mellanmål', icon: 'cafe' },
];

const STORE_COLORS: Record<string, string> = {
  'ICA': '#E3000F',
  'Coop': '#00A94F',
  'Willys': '#FF6B00',
};

export default function OnboardingStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setUserProfile } = useAppStore();
  
  const [selectedMeals, setSelectedMeals] = useState<MealType[]>(['lunch', 'middag']);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [nearbyStores, setNearbyStores] = useState<Array<StoreLocation & { distance: number }>>([]);
  const [allStores, setAllStores] = useState<Array<StoreLocation & { distance: number }>>([]);
  const [showAllStores, setShowAllStores] = useState(false);
  const [wantsMealPrep, setWantsMealPrep] = useState(false);
  const [mealPrepPortions, setMealPrepPortions] = useState(2);
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

  const toggleMeal = (meal: MealType) => {
    setSelectedMeals(prev => 
      prev.includes(meal) 
        ? prev.filter(m => m !== meal)
        : [...prev, meal]
    );
  };

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
    if (selectedMeals.length === 0 || selectedStores.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const numberOfPeople = parseInt(params.numberOfPeople as string);
    const dietaryPreferences = JSON.parse(params.dietaryPreferences as string) as DietaryPreference[];
    const allergies = JSON.parse(params.allergies as string) as Allergen[];
    const address = params.address as string;

    // Konvertera specifika butiksnamn till kategorier för kampanjer
    const storeCategories = selectedStores.map(storeName => {
      const store = nearbyStores.find(s => s.name === storeName);
      return store?.category;
    }).filter((cat): cat is 'ICA' | 'Coop' | 'Willys' => cat !== undefined);

    const profile = {
      numberOfPeople,
      dietaryPreferences,
      allergies,
      location: address,
      selectedMeals,
      selectedStores: storeCategories,
      wantsMealPrep,
      mealPrepPortions,
      onboardingCompleted: true,
    };

    await setUserProfile(profile);
    
    // Navigera till huvudvy
    router.replace('/weekly-plan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Nästan klar!</Text>
          <Text style={styles.subtitle}>Vilka måltider och butiker?</Text>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Vilka måltider vill ni ha?</Text>
          <View style={styles.optionsGrid}>
            {MEAL_TYPES.map((meal) => (
              <TouchableOpacity
                key={meal.value}
                style={[
                  styles.mealOption,
                  selectedMeals.includes(meal.value) && styles.mealOptionSelected
                ]}
                onPress={() => toggleMeal(meal.value)}
              >
                <Ionicons 
                  name={meal.icon as any} 
                  size={28} 
                  color={selectedMeals.includes(meal.value) ? colors.primary : colors.textLight} 
                />
                <Text style={[
                  styles.mealOptionText,
                  selectedMeals.includes(meal.value) && styles.mealOptionTextSelected
                ]}>
                  {meal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <View style={styles.mealPrepHeader}>
            <View style={styles.mealPrepInfo}>
              <Text style={styles.sectionTitle}>Matlådor</Text>
              <Text style={styles.mealPrepDesc}>Få extra portioner för lunch och middag</Text>
            </View>
            <Switch
              value={wantsMealPrep}
              onValueChange={setWantsMealPrep}
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor={wantsMealPrep ? colors.primary : colors.cardBackground}
            />
          </View>
          
          {wantsMealPrep && (
            <View style={styles.portionsCounter}>
              <Text style={styles.portionsLabel}>Extra portioner</Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setMealPrepPortions(Math.max(1, mealPrepPortions - 1))}
                >
                  <Ionicons name="remove" size={20} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{mealPrepPortions}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setMealPrepPortions(Math.min(10, mealPrepPortions + 1))}
                >
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>

        <Card>
          <View style={styles.storesHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {showAllStores ? 'Alla butiker' : 'Butiker nära dig'}
              </Text>
              <Text style={styles.storesSubtitle}>
                {showAllStores 
                  ? `Visar alla ${allStores.length} butiker`
                  : `${nearbyStores.length} butiker inom 15 km från ${params.city}`
                }
              </Text>
            </View>
            <Ionicons name="location" size={24} color={colors.secondary} />
          </View>
          
          {/* Toggle knapp */}
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setShowAllStores(!showAllStores)}
          >
            <Ionicons 
              name={showAllStores ? "navigate-circle" : "map"} 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.toggleButtonText}>
              {showAllStores ? 'Visa bara närliggande' : 'Se alla butiker på karta'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.storesContainer}>
            {(showAllStores ? allStores : nearbyStores).length === 0 ? (
              <View style={styles.emptyStores}>
                <Ionicons name="information-circle-outline" size={40} color={colors.textLight} />
                <Text style={styles.emptyStoresText}>
                  Inga butiker hittades i närheten
                </Text>
              </View>
            ) : (
              (showAllStores ? allStores : nearbyStores).map((store, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.storeOption,
                    selectedStores.includes(store.name) && styles.storeOptionSelected
                  ]}
                  onPress={() => toggleStore(store.name)}
                >
                  <View style={[
                    styles.storeIconCircle, 
                    { backgroundColor: STORE_COLORS[store.category] + '20' }
                  ]}>
                    <Ionicons 
                      name="storefront" 
                      size={24} 
                      color={STORE_COLORS[store.category]} 
                    />
                  </View>
                  <View style={styles.storeInfo}>
                    <Text style={[
                      styles.storeOptionText,
                      selectedStores.includes(store.name) && styles.storeOptionTextSelected
                    ]}>
                      {store.name}
                    </Text>
                    <Text style={styles.storeDistance}>
                      {store.distance < 1 
                        ? `${Math.round(store.distance * 1000)} m` 
                        : `${store.distance.toFixed(1)} km`} bort
                    </Text>
                    <Text style={styles.storeAddress}>{store.address}</Text>
                  </View>
                  {selectedStores.includes(store.name) && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        <Button 
          title="Skapa matsedel" 
          onPress={handleFinish}
          disabled={selectedMeals.length === 0 || selectedStores.length === 0}
          loading={isSubmitting}
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
    paddingBottom: 120,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealOption: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 8,
    minWidth: '45%',
  },
  mealOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  mealOptionText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  mealOptionTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  mealPrepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mealPrepInfo: {
    flex: 1,
  },
  mealPrepDesc: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: -8,
    marginBottom: 8,
  },
  portionsCounter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  portionsLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  counterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  storesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  storesSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
    marginBottom: 16,
    gap: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  storesContainer: {
    gap: 12,
  },
  emptyStores: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStoresText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 12,
  },
  storeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 12,
  },
  storeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
  },
  storeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfo: {
    flex: 1,
  },
  storeOptionText: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '500',
    marginBottom: 2,
  },
  storeOptionTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  storeDistance: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  storeAddress: {
    fontSize: 12,
    color: colors.textLight,
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
