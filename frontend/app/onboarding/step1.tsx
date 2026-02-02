import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { geocodeAddress } from '../data/stores';

export default function OnboardingStep1() {
  const router = useRouter();
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [address, setAddress] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleNext = () => {
    if (!address.trim()) {
      Alert.alert('Adress saknas', 'Vänligen ange din adress för att fortsätta');
      return;
    }

    setIsValidating(true);
    
    // Försök geocoda adressen
    const location = geocodeAddress(address);
    
    if (!location) {
      setIsValidating(false);
      Alert.alert(
        'Okänd adress', 
        'Vi kunde inte hitta butiker nära den adressen. Försök med en adress i Umeå eller Bygdeå.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsValidating(false);
    
    router.push({
      pathname: '/onboarding/step2',
      params: { 
        numberOfPeople: numberOfPeople.toString(),
        address: address,
        userLat: location.lat.toString(),
        userLng: location.lng.toString(),
        city: location.city
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Välkommen!</Text>
          <Text style={styles.subtitle}>Låt oss komma igång med din veckomatsedel</Text>
        </View>

        {/* Address Input */}
        <Card style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={40} color={colors.secondary} />
          </View>
          <Text style={styles.cardTitle}>Din adress</Text>
          <Text style={styles.cardDescription}>
            Vi använder din adress för att hitta butiker i närheten
          </Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="home-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="T.ex. Storgatan 12, Umeå"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
          
          <View style={styles.exampleAddresses}>
            <Text style={styles.exampleTitle}>Exempel:</Text>
            <TouchableOpacity 
              style={styles.exampleChip}
              onPress={() => setAddress('Ersboda Centrum, Umeå')}
            >
              <Text style={styles.exampleText}>Ersboda Centrum, Umeå</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.exampleChip}
              onPress={() => setAddress('Storgatan, Bygdeå')}
            >
              <Text style={styles.exampleText}>Storgatan, Bygdeå</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* People Counter */}
        <Card style={styles.card}>
          <View style={styles.counterContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight + '30' }]}>
              <Ionicons name="people" size={40} color={colors.primary} />
            </View>
            
            <View style={styles.counter}>
              <Text style={styles.cardTitle}>Hur många är ni i hushållet?</Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                  disabled={numberOfPeople <= 1}
                >
                  <Ionicons name="remove" size={24} color={numberOfPeople <= 1 ? colors.textLight : colors.primary} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{numberOfPeople}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setNumberOfPeople(Math.min(10, numberOfPeople + 1))}
                >
                  <Ionicons name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Vi visar butiker i närheten och anpassar portionerna efter {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'personer'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Button 
          title="Hitta butiker" 
          onPress={handleNext}
          loading={isValidating}
          disabled={!address.trim()}
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
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 24,
  },
  card: {
    marginVertical: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },
  exampleAddresses: {
    marginTop: 16,
    gap: 8,
  },
  exampleTitle: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  exampleChip: {
    backgroundColor: colors.secondaryLight + '20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  exampleText: {
    fontSize: 13,
    color: colors.text,
  },
  counterContainer: {
    alignItems: 'center',
  },
  counter: {
    width: '100%',
    alignItems: 'center',
  },
  counterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    minWidth: 80,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryLight + '20',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
