import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from './store';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { colors } from './utils/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Översättningar för kostpreferenser
const DIET_LABELS: Record<string, string> = {
  'allatare': 'Allätare',
  'pescetariansk': 'Pescetariansk',
  'flexitariansk': 'Flexitariansk',
};

// Översättningar för allergier
const ALLERGY_LABELS: Record<string, string> = {
  'gluten': 'Gluten',
  'laktos': 'Laktos',
  'mjolkprotein': 'Mjölkprotein',
  'agg': 'Ägg',
  'notter': 'Nötter/jordnötter',
  'soja': 'Soja',
  'fisk': 'Fisk',
  'skaldjur': 'Skaldjur',
  'sesam': 'Sesam',
};

export default function Profile() {
  const router = useRouter();
  const { userProfile, generateShoppingList } = useAppStore();

  const handleRegenerateList = () => {
    generateShoppingList();
    if (Platform.OS === 'web') {
      alert('Inköpslistan har uppdaterats!');
      router.back();
    }
  };

  const handleResetApp = async () => {
    const confirmed = Platform.OS === 'web' 
      ? window.confirm('Vill du verkligen ta bort all data och börja om från början?')
      : true;
    
    if (confirmed) {
      await AsyncStorage.clear();
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      router.replace('/');
    }
  };

  const handleEditProfile = () => {
    router.push('/onboarding/step1');
  };

  if (!userProfile) {
    return null;
  }

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
        <Text style={styles.headerTitle}>Min Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Household Info */}
        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Hushåll</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Antal personer:</Text>
            <Text style={styles.infoValue}>{userProfile.numberOfPeople}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plats:</Text>
            <Text style={styles.infoValue}>{userProfile.location || 'Ej angiven'}</Text>
          </View>
        </Card>

        {/* Dietary Preference */}
        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={24} color={colors.secondary} />
            <Text style={styles.sectionTitle}>Kostpreferens</Text>
          </View>
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, styles.prefTag]}>
              <Text style={styles.tagText}>
                {DIET_LABELS[userProfile.dietaryPreference] || userProfile.dietaryPreference}
              </Text>
            </View>
          </View>
        </Card>

        {/* Allergies */}
        {userProfile.allergies && userProfile.allergies.length > 0 && (
          <Card>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle" size={24} color={colors.error} />
              <Text style={styles.sectionTitle}>Allergier</Text>
            </View>
            <View style={styles.tagsContainer}>
              {userProfile.allergies.map((allergy, index) => (
                <View key={index} style={[styles.tag, styles.allergyTag]}>
                  <Text style={styles.tagText}>{ALLERGY_LABELS[allergy] || allergy}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Stores */}
        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="storefront" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Valda butiker</Text>
          </View>
          <View style={styles.tagsContainer}>
            {userProfile.selectedStores.map((store, index) => (
              <View key={index} style={[styles.tag, styles.storeTag]}>
                <Text style={styles.tagText}>{store}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button 
            title="Redigera profil" 
            onPress={handleEditProfile}
            variant="secondary"
          />
          <Button 
            title="Uppdatera inköpslista" 
            onPress={handleRegenerateList}
            variant="secondary"
          />
          <Button 
            title="Återställ app" 
            onPress={handleResetApp}
            variant="outline"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Kampanjappen v1.0</Text>
          <Text style={styles.footerText}>Med ❤️ från Sverige</Text>
        </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  prefTag: {
    backgroundColor: colors.secondary + '30',
  },
  allergyTag: {
    backgroundColor: colors.error + '20',
  },
  storeTag: {
    backgroundColor: colors.primary + '20',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  actionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  footer: {
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    marginVertical: 4,
  },
});
