import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from './store';
import { colors } from './utils/colors';

export default function Index() {
  const router = useRouter();
  const { userProfile, loadFromStorage } = useAppStore();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initialize = async () => {
      await loadFromStorage();
      setIsLoading(false);
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!userProfile || !userProfile.onboardingCompleted) {
        // Navigera till onboarding
        router.replace('/onboarding/step1');
      } else {
        // Navigera till huvudvy
        router.replace('/weekly-plan');
      }
    }
  }, [isLoading, userProfile]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.title}>Veckomatsedeln</Text>
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
});