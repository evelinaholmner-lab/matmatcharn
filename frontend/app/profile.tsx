import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from './store';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { colors } from './utils/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const router = useRouter();
  const { userProfile, generateWeeklyMealPlan } = useAppStore();

  const handleRegenerateWeek = () => {
    generateWeeklyMealPlan();
    Alert.alert('Uppdaterat!', 'En ny veckomatsedel har genererats', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleResetApp = () => {
    Alert.alert(
      'Återställ app',
      'Vill du verkligen ta bort all data och börja om från början?',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Återställ',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            // För web: rensa localStorage också
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.clear();
            }
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Redigera profil',
      'Välj vad du vill ändra',
      [
        { 
          text: 'Ändra adress & butiker',
          onPress: () => router.push('/onboarding/step1')
        },
        { 
          text: 'Ändra kostpreferenser',
          onPress: () => router.push({
            pathname: '/onboarding/step2',
            params: {
              numberOfPeople: userProfile.numberOfPeople.toString(),
              address: userProfile.location,
              userLat: '63.8258',
              userLng: '20.2630',
              city: 'Umeå'
            }
          })
        },
        { text: 'Avbryt', style: 'cancel' }
      ]
    );
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
          {userProfile.wantsMealPrep && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Matlådor (extra portioner):</Text>
              <Text style={styles.infoValue}>{userProfile.mealPrepPortions}</Text>
            </View>
          )}
        </Card>

        {/* Dietary Preferences */}
        {userProfile.dietaryPreferences.length > 0 && (
          <Card>
            <View style={styles.sectionHeader}>
              <Ionicons name="leaf" size={24} color={colors.secondary} />
              <Text style={styles.sectionTitle}>Kostpreferenser</Text>
            </View>
            <View style={styles.tagsContainer}>
              {userProfile.dietaryPreferences.map((pref, index) => (
                <View key={index} style={[styles.tag, styles.prefTag]}>
                  <Text style={styles.tagText}>{pref}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Allergies */}
        {userProfile.allergies.length > 0 && (
          <Card>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle" size={24} color={colors.error} />
              <Text style={styles.sectionTitle}>Allergier</Text>
            </View>
            <View style={styles.tagsContainer}>
              {userProfile.allergies.map((allergy, index) => (
                <View key={index} style={[styles.tag, styles.allergyTag]}>
                  <Text style={styles.tagText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Selected Meals */}
        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={24} color={colors.accent} />
            <Text style={styles.sectionTitle}>Valda måltider</Text>
          </View>
          <View style={styles.tagsContainer}>
            {userProfile.selectedMeals.map((meal, index) => (
              <View key={index} style={[styles.tag, styles.mealTag]}>
                <Text style={styles.tagText}>{meal}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Stores */}
        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="storefront" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Butiker</Text>
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
            title="Generera ny vecka" 
            onPress={handleRegenerateWeek}
            variant="secondary"
          />
          <Button 
            title="Återställ app" 
            onPress={handleResetApp}
            variant="outline"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Veckomatsedel App v1.0</Text>
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
  mealTag: {
    backgroundColor: colors.accent + '30',
  },
  storeTag: {
    backgroundColor: colors.primary + '20',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'capitalize',
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