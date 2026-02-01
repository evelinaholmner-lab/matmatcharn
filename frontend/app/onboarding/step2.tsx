import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../utils/colors';
import { DietaryPreference, Allergen } from '../types';
import { Ionicons } from '@expo/vector-icons';

const DIETARY_PREFERENCES: { label: string; value: DietaryPreference; icon: string }[] = [
  { label: 'Vegetariskt', value: 'vegetariskt', icon: 'leaf' },
  { label: 'Veganskt', value: 'veganskt', icon: 'nutrition' },
  { label: 'Barnvänlig', value: 'barnvänlig', icon: 'happy' },
  { label: 'Keto', value: 'keto', icon: 'fitness' },
  { label: 'Proteinrik', value: 'proteinrik', icon: 'barbell' },
];

const ALLERGENS: { label: string; value: Allergen; icon: string }[] = [
  { label: 'Nötter', value: 'nöt', icon: 'alert-circle' },
  { label: 'Ägg', value: 'ägg', icon: 'alert-circle' },
  { label: 'Laktos', value: 'laktos', icon: 'alert-circle' },
  { label: 'Mjölkprotein', value: 'mjölkprotein', icon: 'alert-circle' },
  { label: 'Gluten', value: 'gluten', icon: 'alert-circle' },
];

export default function OnboardingStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedPreferences, setSelectedPreferences] = useState<DietaryPreference[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<Allergen[]>([]);

  const togglePreference = (pref: DietaryPreference) => {
    setSelectedPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const toggleAllergy = (allergy: Allergen) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/step3',
      params: {
        numberOfPeople: params.numberOfPeople,
        dietaryPreferences: JSON.stringify(selectedPreferences),
        allergies: JSON.stringify(selectedAllergies),
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
          <Text style={styles.subtitle}>Vilka är era matpreferenser?</Text>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Kostpreferenser (valfritt)</Text>
          <View style={styles.optionsGrid}>
            {DIETARY_PREFERENCES.map((pref) => (
              <TouchableOpacity
                key={pref.value}
                style={[
                  styles.option,
                  selectedPreferences.includes(pref.value) && styles.optionSelected
                ]}
                onPress={() => togglePreference(pref.value)}
              >
                <Ionicons 
                  name={pref.icon as any} 
                  size={24} 
                  color={selectedPreferences.includes(pref.value) ? colors.primary : colors.textLight} 
                />
                <Text style={[
                  styles.optionText,
                  selectedPreferences.includes(pref.value) && styles.optionTextSelected
                ]}>
                  {pref.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Allergier</Text>
          <View style={styles.optionsGrid}>
            {ALLERGENS.map((allergy) => (
              <TouchableOpacity
                key={allergy.value}
                style={[
                  styles.option,
                  styles.allergyOption,
                  selectedAllergies.includes(allergy.value) && styles.allergySelected
                ]}
                onPress={() => toggleAllergy(allergy.value)}
              >
                <Ionicons 
                  name={allergy.icon as any} 
                  size={24} 
                  color={selectedAllergies.includes(allergy.value) ? colors.error : colors.textLight} 
                />
                <Text style={[
                  styles.optionText,
                  selectedAllergies.includes(allergy.value) && styles.allergyTextSelected
                ]}>
                  {allergy.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 8,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  allergyOption: {
    borderColor: colors.border,
  },
  allergySelected: {
    borderColor: colors.error,
    backgroundColor: colors.error + '15',
  },
  optionText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.text,
  },
  allergyTextSelected: {
    color: colors.text,
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