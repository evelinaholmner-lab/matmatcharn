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

// Nya kostpreferenser (singel val)
const DIETARY_PREFERENCES: { label: string; value: DietaryPreference; icon: string; description: string }[] = [
  { label: 'Allätare', value: 'allatare', icon: 'restaurant', description: 'Äter allt' },
  { label: 'Pescetariansk', value: 'pescetariansk', icon: 'fish', description: 'Fisk, ej kött' },
  { label: 'Flexitariansk', value: 'flexitariansk', icon: 'leaf', description: 'Mest vegetariskt' },
];

// Utökade allergier (flerval)
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

export default function OnboardingStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedPreference, setSelectedPreference] = useState<DietaryPreference>('allatare');
  const [selectedAllergies, setSelectedAllergies] = useState<Allergen[]>([]);

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
        address: params.address,
        userLat: params.userLat,
        userLng: params.userLng,
        city: params.city,
        dietaryPreference: selectedPreference,
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
          <Text style={styles.subtitle}>Anpassa dina val</Text>
        </View>

        {/* Kostpreferens - singel val */}
        <Card>
          <Text style={styles.sectionTitle}>Kostpreferens</Text>
          <Text style={styles.sectionHint}>Välj ett alternativ</Text>
          <View style={styles.preferenceList}>
            {DIETARY_PREFERENCES.map((pref) => (
              <TouchableOpacity
                key={pref.value}
                style={[
                  styles.preferenceOption,
                  selectedPreference === pref.value && styles.preferenceSelected
                ]}
                onPress={() => setSelectedPreference(pref.value)}
              >
                <View style={[
                  styles.radioOuter,
                  selectedPreference === pref.value && styles.radioOuterSelected
                ]}>
                  {selectedPreference === pref.value && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <View style={styles.preferenceContent}>
                  <View style={styles.preferenceHeader}>
                    <Ionicons 
                      name={pref.icon as any} 
                      size={22} 
                      color={selectedPreference === pref.value ? colors.primary : colors.textLight} 
                    />
                    <Text style={[
                      styles.preferenceLabel,
                      selectedPreference === pref.value && styles.preferenceLabelSelected
                    ]}>
                      {pref.label}
                    </Text>
                  </View>
                  <Text style={styles.preferenceDescription}>{pref.description}</Text>
                </View>
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

        {/* Sammanfattning */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="restaurant" size={20} color={colors.primary} />
            <Text style={styles.summaryText}>
              {DIETARY_PREFERENCES.find(p => p.value === selectedPreference)?.label}
            </Text>
          </View>
          {selectedAllergies.length > 0 && (
            <View style={styles.summaryRow}>
              <Ionicons name="alert-circle" size={20} color={colors.error} />
              <Text style={styles.summaryText}>
                {selectedAllergies.length} allergi{selectedAllergies.length > 1 ? 'er' : ''} att undvika
              </Text>
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
  preferenceList: {
    gap: 12,
  },
  preferenceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 12,
  },
  preferenceSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '15',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  preferenceLabelSelected: {
    color: colors.primary,
  },
  preferenceDescription: {
    fontSize: 14,
    color: colors.textLight,
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
  // Sammanfattning
  summaryCard: {
    backgroundColor: colors.primaryLight + '10',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
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
