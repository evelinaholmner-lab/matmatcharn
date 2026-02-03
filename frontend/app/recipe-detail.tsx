import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from './components/Card';
import { colors } from './utils/colors';
import { recipes } from './data/recipes';
import { getRecipeImage } from './data/recipe-images';
import { Ionicons } from '@expo/vector-icons';

const MEAL_COLORS = {
  frukost: colors.frukost,
  lunch: colors.lunch,
  middag: colors.middag,
  mellanmål: colors.mellanmål,
};

export default function RecipeDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imageLoading, setImageLoading] = useState(true);
  
  const recipe = recipes.find(r => r.id === params.recipeId);
  const recipeImage = recipe ? getRecipeImage(recipe.name, recipe.mealType) : '';

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textLight} />
          <Text style={styles.errorText}>Recept hittades inte</Text>
        </View>
      </SafeAreaView>
    );
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
        <Text style={styles.headerTitle}>{recipe.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero with Image */}
        <View style={[styles.hero, { backgroundColor: recipe.imageColor }]}>
          {imageLoading && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          <Image
            source={{ uri: recipeImage }}
            style={styles.heroImage}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.mealTypeBadge}>
              <Text style={styles.mealTypeText}>{recipe.mealType.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Meta Info */}
        <Card>
          <Text style={styles.description}>{recipe.description}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.metaText}>{recipe.prepTime + recipe.cookTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={20} color={colors.secondary} />
              <Text style={styles.metaText}>{recipe.servings} portioner</Text>
            </View>
          </View>

          {/* Dietary Tags */}
          {recipe.dietaryTags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Passar för</Text>
              <View style={styles.tags}>
                {recipe.dietaryTags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Allergens */}
          {recipe.allergens.length > 0 && (
            <View style={styles.allergensSection}>
              <View style={styles.allergenHeader}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Innehåller</Text>
              </View>
              <View style={styles.tags}>
                {recipe.allergens.map((allergen, index) => (
                  <View key={index} style={[styles.tag, styles.allergenTag]}>
                    <Text style={styles.allergenText}>{allergen}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Card>

        {/* Ingredients */}
        <Card>
          <Text style={styles.sectionTitle}>Ingredienser</Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Instructions */}
        <Card>
          <Text style={styles.sectionTitle}>Instruktioner</Text>
          <View style={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Time Breakdown */}
        <Card>
          <Text style={styles.sectionTitle}>Tidsåtgång</Text>
          <View style={styles.timeBreakdown}>
            <View style={styles.timeItem}>
              <Ionicons name="cut-outline" size={24} color={colors.accent} />
              <Text style={styles.timeLabel}>Förberedelse</Text>
              <Text style={styles.timeValue}>{recipe.prepTime} min</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeItem}>
              <Ionicons name="flame-outline" size={24} color={colors.error} />
              <Text style={styles.timeLabel}>Tillagning</Text>
              <Text style={styles.timeValue}>{recipe.cookTime} min</Text>
            </View>
          </View>
        </Card>
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  hero: {
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heroContent: {
    alignItems: 'center',
    paddingBottom: 20,
    zIndex: 5,
  },
  mealTypeBadge: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tagsSection: {
    marginTop: 16,
  },
  allergensSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  allergenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.success + '20',
    gap: 4,
  },
  tagText: {
    fontSize: 14,
    color: colors.text,
    textTransform: 'capitalize',
  },
  allergenTag: {
    backgroundColor: colors.error + '15',
  },
  allergenText: {
    fontSize: 14,
    color: colors.text,
    textTransform: 'capitalize',
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textInverse,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  timeBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  timeDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: colors.textLight,
    marginTop: 16,
  },
});
