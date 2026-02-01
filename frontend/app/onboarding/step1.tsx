import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';

const LOCATIONS = [
  { name: 'Umeå', region: 'Västerbotten' },
  { name: 'Bygdeå', region: 'Västerbotten' },
  { name: 'Skellefteå', region: 'Västerbotten' },
  { name: 'Lycksele', region: 'Västerbotten' },
];

export default function OnboardingStep1() {
  const router = useRouter();
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [selectedLocation, setSelectedLocation] = useState('Umeå');

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/step2',
      params: { 
        numberOfPeople: numberOfPeople.toString(),
        location: selectedLocation
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Välkommen!</Text>
          <Text style={styles.subtitle}>Hur många är ni i hushållet?</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.counterContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={40} color={colors.primary} />
            </View>
            
            <View style={styles.counter}>
              <Text style={styles.counterLabel}>Antal personer</Text>
              <View style={styles.counterButtons}>
                <Button 
                  title="-"
                  onPress={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                  variant="outline"
                  disabled={numberOfPeople <= 1}
                />
                <Text style={styles.counterValue}>{numberOfPeople}</Text>
                <Button 
                  title="+"
                  onPress={() => setNumberOfPeople(Math.min(10, numberOfPeople + 1))}
                  variant="outline"
                />
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Vi kommer anpassa portionsstorlekarna efter antalet personer
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
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
    marginBottom: 32,
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
  card: {
    marginVertical: 16,
  },
  counterContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  counter: {
    width: '100%',
    alignItems: 'center',
  },
  counterLabel: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  counterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
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