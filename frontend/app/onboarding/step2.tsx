import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../utils/colors';
import { DietaryPreference, Allergen, MealType } from '../types';
import { Ionicons } from '@expo/vector-icons';

// Kostpreferenser (flerval)
const DIETARY_PREFERENCES: { label: string; value: DietaryPreference; icon: string; description: string }[] = [
  { label: 'Allätare', value: 'allatare', icon: 'restaurant', description: 'Äter allt' },
  { label: 'Pescetariansk', value: 'pescetariansk', icon: 'fish', description: 'Fisk, ej kött' },
  { label: 'Flexitariansk', value: 'flexitariansk', icon: 'leaf', description: 'Mest vegetariskt' },
  { label: 'Vegetarian', value: 'vegetarian', icon: 'leaf', description: 'Inget kött eller fisk' },
  { label: 'Vegan', value: 'vegan', icon: 'leaf', description: 'Inga animaliska produkter' },
  { label: 'Keto', value: 'keto', icon: 'flame', description: 'Mycket fett, lite kolhydrater' },
  { label: 'LCHF', value: 'lchf', icon: 'flame', description: 'Låg kolhydrat, hög fett' },
];

// Allergier (flerval)
const ALLERGENS: { label: string; value: Allergen; icon: string }[] = [
  { label: 'Gluten', value: 'gluten', icon: 'ban' },
  { label: 'Laktos', value: 'laktos', icon: 'ban' },
  { label: 'Mjölkprotein', value: 'mjolkprotein', icon: 'ban' },
  { label: 'Ägg', value: 'agg', icon: 'ban' },
  { label: 'Nötter / jordnötter', value: 'notter', icon: 'ban' },
  { label: 'Soja', value: 'soja', icon: 'ban' },
  { label: 'Fisk', value: 'fisk', icon: 'ban' },
  { label: 'Skaldjur', value: 'skaldjur', icon: 'ban' },
  { label: 'Sesam', value: 'sesam', icon: 'ban' },
];

// Måltider per dag (flerval)
const MEAL_TYPES: { label: string; value: MealType; icon: string }[] = [
  { label: 'Frukost', value: 'frukost', icon: 'sunny-outline' },
  { label: 'Lunch', value: 'lunch', icon: 'restaurant-outline' },
  { label: 'Middag', value: 'middag', icon: 'moon-outline' },
  { label: 'Mellanmål', value: 'mellanmal', icon: 'cafe-outline' },
];

export default function OnboardingStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedPreferences, setSelectedPreferences] = useState<DietaryPreference[]>(['allatare']);
  const [selectedAllergies, setSelectedAllergies] = useState<Allergen[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<MealType[]>(['frukost', 'lunch', 'middag']);
  const [lunchboxCount, setLunchboxCount] = useState(0);
  const [wantsBatchCooking, setWantsBatchCooking] = useState(false);

  const togglePreference = (pref: DietaryPreference) => {
    setSelectedPreferences(prev => {
      if (prev.includes(pref)) {
        // Minst en måste vara vald
        if (prev.length === 1) return prev;
        return prev.filter(p => p !== pref);
      }
      return [...prev, pref];
    });
  };

  const toggleAllergy = (allergy: Allergen) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const toggleMeal = (meal: MealType) => {
    setSelectedMeals(prev => {
      if (prev.includes(meal)) {
        // Minst en måste vara vald
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== meal);
      }
      return [...prev, meal];
    });
  };

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/step3',
      params: {
        numberOfPeople: params.numberOfPeople,
        address: params.address,
        userLat: params.userLat,
        userLng: params.userLng,
        city: params.city,
        dietaryPreferences: JSON.stringify(selectedPreferences),
        allergies: JSON.stringify(selectedAllergies),
        selectedMeals: JSON.stringify(selectedMeals),
        lunchboxCount: lunchboxCount.toString(),
        wantsBatchCooking: wantsBatchCooking ? 'true' : 'false',
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Kostpreferenser</Text>
          <Text style={styles.subtitle}>Anpassa din veckomeny</Text>
        </View>

        {/* Kostpreferens - flerval */}
        <Card>
          <Text style={styles.sectionTitle}>Kostpreferens</Text>
          <Text style={styles.sectionHint}>Välj alla som gäller</Text>
          <View style={styles.preferenceGrid}>
            {DIETARY_PREFERENCES.map((pref) => (
              <TouchableOpacity
                key={pref.value}
                style={[
                  styles.preferenceChip,
                  selectedPreferences.includes(pref.value) && styles.preferenceChipSelected
                ]}
                onPress={() => togglePreference(pref.value)}
              >
                <Ionicons 
                  name={pref.icon as any} 
                  size={18} 
                  color={selectedPreferences.includes(pref.value) ? '#fff' : colors.textLight} 
                />
                <Text style={[
                  styles.preferenceChipText,
                  selectedPreferences.includes(pref.value) && styles.preferenceChipTextSelected
                ]}>
                  {pref.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Allergier - flerval */}
        <Card>
          <Text style={styles.sectionTitle}>Allergier</Text>
          <Text style={styles.sectionHint}>Välj alla som gäller</Text>
          <View style={styles.allergiesGrid}>
            {ALLERGENS.map((allergy) => (
              <TouchableOpacity
                key={allergy.value}
                style={[
                  styles.allergyChip,
                  selectedAllergies.includes(allergy.value) && styles.allergyChipSelected
                ]}
                onPress={() => toggleAllergy(allergy.value)}
              >
                {selectedAllergies.includes(allergy.value) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
                <Text style={[
                  styles.allergyChipText,
                  selectedAllergies.includes(allergy.value) && styles.allergyChipTextSelected
                ]}>
                  {allergy.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedAllergies.length === 0 && (
            <View style={styles.noAllergiesHint}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.noAllergiesText}>Inga allergier valda</Text>
            </View>
          )}
        </Card>

        {/* Måltider per dag */}
        <Card>
          <Text style={styles.sectionTitle}>Måltider per dag</Text>
          <Text style={styles.sectionHint}>Vilka måltider vill du ha förslag på?</Text>
          <View style={styles.mealsGrid}>
            {MEAL_TYPES.map((meal) => (
              <TouchableOpacity
                key={meal.value}
                style={[
                  styles.mealButton,
                  selectedMeals.includes(meal.value) && styles.mealButtonSelected
                ]}
                onPress={() => toggleMeal(meal.value)}
              >
                <View style={[
                  styles.mealIconContainer,
                  selectedMeals.includes(meal.value) && styles.mealIconContainerSelected
                ]}>
                  <Ionicons 
                    name={meal.icon as any} 
                    size={24} 
                    color={selectedMeals.includes(meal.value) ? '#fff' : colors.textLight} 
                  />
                </View>
                <Text style={[
                  styles.mealLabel,
                  selectedMeals.includes(meal.value) && styles.mealLabelSelected
                ]}>
                  {meal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Matlåda */}
        <Card>
          <Text style={styles.sectionTitle}>Matlåda</Text>
          <Text style={styles.sectionHint}>Vill du ta med lunch till jobbet/skolan?</Text>
          <View style={styles.lunchboxContainer}>
            <TouchableOpacity
              style={[styles.lunchboxButton, lunchboxCount === 0 && styles.lunchboxButtonSelected]}
              onPress={() => setLunchboxCount(0)}
            >
              <Ionicons 
                name="close-circle" 
                size={24} 
                color={lunchboxCount === 0 ? '#fff' : colors.textLight} 
              />
              <Text style={[styles.lunchboxText, lunchboxCount === 0 && styles.lunchboxTextSelected]}>Nej</Text>
            </TouchableOpacity>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity
                key={num}
                style={[styles.lunchboxButton, lunchboxCount === num && styles.lunchboxButtonSelected]}
                onPress={() => setLunchboxCount(num)}
              >
                <Text style={[styles.lunchboxNumber, lunchboxCount === num && styles.lunchboxTextSelected]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {lunchboxCount > 0 && (
            <Text style={styles.lunchboxHint}>
              {lunchboxCount} matlåd{lunchboxCount > 1 ? 'or' : 'a'} per dag
            </Text>
          )}
        </Card>

        {/* Preppa / Batch */}
        <Card>
          <Text style={styles.sectionTitle}>Preppa / Batch-laga</Text>
          <Text style={styles.sectionHint}>Vill du laga större mängder och spara tid?</Text>
          <View style={styles.batchContainer}>
            <TouchableOpacity
              style={[styles.batchButton, !wantsBatchCooking && styles.batchButtonInactive]}
              onPress={() => setWantsBatchCooking(false)}
            >
              <Ionicons name="close" size={20} color={!wantsBatchCooking ? '#fff' : colors.textLight} />
              <Text style={[styles.batchText, !wantsBatchCooking && styles.batchTextActive]}>Nej tack</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.batchButton, wantsBatchCooking && styles.batchButtonActive]}
              onPress={() => setWantsBatchCooking(true)}
            >
              <Ionicons name="checkmark" size={20} color={wantsBatchCooking ? '#fff' : colors.textLight} />
              <Text style={[styles.batchText, wantsBatchCooking && styles.batchTextActive]}>Ja, gärna!</Text>
            </TouchableOpacity>
          </View>
          {wantsBatchCooking && (
            <View style={styles.batchInfo}>
              <Ionicons name="information-circle" size={18} color={colors.primary} />
              <Text style={styles.batchInfoText}>
                Vi föreslår rätter som kan lagas i större mängd och återanvändas
              </Text>
            </View>
          )}
        </Card>

        {/* Sammanfattning */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Sammanfattning</Text>
          <View style={styles.summaryRow}>
            <Ionicons name="restaurant" size={18} color={colors.primary} />
            <Text style={styles.summaryText}>
              {selectedPreferences.map(p => DIETARY_PREFERENCES.find(dp => dp.value === p)?.label).join(', ')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="time" size={18} color={colors.primary} />
            <Text style={styles.summaryText}>
              {selectedMeals.length} måltid{selectedMeals.length > 1 ? 'er' : ''}/dag
            </Text>
          </View>
          {selectedAllergies.length > 0 && (
            <View style={styles.summaryRow}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.summaryText}>
                {selectedAllergies.length} allergi{selectedAllergies.length > 1 ? 'er' : ''} att undvika
              </Text>
            </View>
          )}
          {lunchboxCount > 0 && (
            <View style={styles.summaryRow}>
              <Ionicons name="briefcase" size={18} color={colors.primary} />
              <Text style={styles.summaryText}>{lunchboxCount} matlåda/dag</Text>
            </View>
          )}
          {wantsBatchCooking && (
            <View style={styles.summaryRow}>
              <Ionicons name="layers" size={18} color={colors.primary} />
              <Text style={styles.summaryText}>Batch-lagning aktiverad</Text>
            </View>
          )}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
        <Button title="Nästa" onPress={handleNext} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  // Kostpreferens styles
  preferenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preferenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 6,
  },
  preferenceChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  preferenceChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  preferenceChipTextSelected: {
    color: '#fff',
  },
  // Allergier styles
  allergiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  allergyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 6,
  },
  allergyChipSelected: {
    borderColor: colors.error,
    backgroundColor: colors.error,
  },
  allergyChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  allergyChipTextSelected: {
    color: '#fff',
  },
  noAllergiesHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  noAllergiesText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
  // Meals styles
  mealsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  mealButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  mealButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  mealIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealIconContainerSelected: {
    backgroundColor: colors.primary,
  },
  mealLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
  },
  mealLabelSelected: {
    color: colors.primary,
  },
  // Lunchbox styles
  lunchboxContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  lunchboxButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  lunchboxButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  lunchboxText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: 4,
  },
  lunchboxTextSelected: {
    color: '#fff',
  },
  lunchboxNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  lunchboxHint: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  // Batch styles
  batchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  batchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 8,
  },
  batchButtonInactive: {
    borderColor: colors.textLight,
    backgroundColor: colors.textLight,
  },
  batchButtonActive: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  batchText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  batchTextActive: {
    color: '#fff',
  },
  batchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.primaryLight + '15',
    borderRadius: 10,
    gap: 8,
  },
  batchInfoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  // Sammanfattning
  summaryCard: {
    backgroundColor: colors.primaryLight + '10',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  // Footer
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
