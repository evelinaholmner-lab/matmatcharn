import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from './store';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { colors } from './utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale/sv';
import { Recipe, MealType } from './types';
import { recipes } from './data/recipes';

const MEAL_COLORS: Record<MealType, string> = {
  frukost: colors.frukost,
  lunch: colors.lunch,
  middag: colors.middag,
  mellanmål: colors.mellanmål,
};

const MEAL_ICONS: Record<MealType, string> = {
  frukost: 'sunny',
  lunch: 'restaurant',
  middag: 'moon',
  mellanmål: 'cafe',
};

export default function WeeklyPlan() {
  const router = useRouter();
  const { weeklyMealPlan, userProfile, generateWeeklyMealPlan, replaceMeal } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [replaceModalVisible, setReplaceModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);

  const handleRefresh = () => {
    setRefreshing(true);
    generateWeeklyMealPlan();
    setTimeout(() => setRefreshing(false), 500);
  };

  const openReplaceModal = (dayIndex: number, mealType: MealType) => {
    setSelectedDay(dayIndex);
    setSelectedMealType(mealType);
    setReplaceModalVisible(true);
  };

  const handleReplaceRecipe = (newRecipe: Recipe) => {
    if (selectedDay !== null && selectedMealType) {
      replaceMeal(selectedDay, selectedMealType, newRecipe);
      setReplaceModalVisible(false);
    }
  };

  // Filtrera recept för ersättning
  const getAvailableRecipes = (): Recipe[] => {
    if (!selectedMealType || !userProfile) return [];

    return recipes.filter(recipe => {
      // Rätt måltidstyp
      if (recipe.mealType !== selectedMealType) return false;
      
      // Kolla allergier
      const hasAllergen = recipe.allergens.some(allergen => 
        userProfile.allergies.includes(allergen)
      );
      if (hasAllergen) return false;
      
      // Kolla kostpreferenser om några är valda
      if (userProfile.dietaryPreferences.length > 0) {
        const matchesPreference = userProfile.dietaryPreferences.some(pref =>
          recipe.dietaryTags.includes(pref)
        );
        if (!matchesPreference) return false;
      }
      
      return true;
    });
  };

  if (!weeklyMealPlan || !userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>Ingen matsedel genererad</Text>
          <Button title="Skapa matsedel" onPress={generateWeeklyMealPlan} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Veckomatsedel</Text>
            <Text style={styles.headerSubtitle}>
              {format(weeklyMealPlan.weekStart, 'MMMM yyyy', { locale: sv })}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Ny vecka</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => router.push('/shopping-list')}
          >
            <Ionicons name="cart" size={20} color={colors.textInverse} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextInverse]}>
              Shoppinglista
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Days */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {weeklyMealPlan.days.map((day, dayIndex) => (
          <Card key={dayIndex} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>
                {format(day.date, 'EEEE', { locale: sv })}
              </Text>
              <Text style={styles.dayDate}>
                {format(day.date, 'd MMM', { locale: sv })}
              </Text>
            </View>

            <View style={styles.mealsContainer}>
              {day.meals.map((meal, mealIndex) => (
                <View key={mealIndex} style={styles.mealItem}>
                  <View 
                    style={[
                      styles.mealTypeIndicator, 
                      { backgroundColor: MEAL_COLORS[meal.mealType] }
                    ]}
                  >
                    <Ionicons 
                      name={MEAL_ICONS[meal.mealType] as any} 
                      size={16} 
                      color={colors.text} 
                    />
                  </View>
                  
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealType}>
                      {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                    </Text>
                    <Text style={styles.recipeName}>{meal.recipe.name}</Text>
                    <Text style={styles.recipeDetails}>
                      {meal.portions} portioner · {meal.recipe.prepTime + meal.recipe.cookTime} min
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.replaceButton}
                    onPress={() => openReplaceModal(dayIndex, meal.mealType)}
                  >
                    <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Replace Recipe Modal */}
      <Modal
        visible={replaceModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReplaceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Välj nytt recept</Text>
              <TouchableOpacity onPress={() => setReplaceModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={getAvailableRecipes()}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.recipeOption}
                  onPress={() => handleReplaceRecipe(item)}
                >
                  <View 
                    style={[
                      styles.recipeColorCircle, 
                      { backgroundColor: item.imageColor }
                    ]} 
                  />
                  <View style={styles.recipeOptionInfo}>
                    <Text style={styles.recipeOptionName}>{item.name}</Text>
                    <Text style={styles.recipeOptionDetails}>
                      {item.prepTime + item.cookTime} min · {item.servings} portioner
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  iconButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    gap: 8,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButtonTextInverse: {
    color: colors.textInverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dayCard: {
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  dayDate: {
    fontSize: 14,
    color: colors.textLight,
    textTransform: 'capitalize',
  },
  mealsContainer: {
    gap: 12,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealTypeIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 12,
    color: colors.textLight,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  recipeDetails: {
    fontSize: 12,
    color: colors.textLight,
  },
  replaceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textLight,
    marginVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  recipeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  recipeColorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  recipeOptionInfo: {
    flex: 1,
  },
  recipeOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  recipeOptionDetails: {
    fontSize: 12,
    color: colors.textLight,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 24,
  },
});
