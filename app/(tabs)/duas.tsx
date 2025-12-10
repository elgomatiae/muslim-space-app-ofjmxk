
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';
import { supabase } from '../../lib/supabase';

interface Dua {
  id: string;
  category_id: string;
  category_title: string;
  category_icon: string;
  category_color: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export default function DuasScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [duas, setDuas] = useState<Dua[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);

  useEffect(() => {
    loadDuas();
  }, []);

  const loadDuas = async () => {
    try {
      const { data, error } = await supabase
        .from('duas')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error loading duas:', error);
      } else {
        setDuas(data || []);
      }
    } catch (error) {
      console.error('Error loading duas:', error);
    }
  };

  const getCategories = () => {
    const categoryMap = new Map<string, { title: string; icon: string; color: string; count: number }>();
    
    duas.forEach(dua => {
      if (!categoryMap.has(dua.category_id)) {
        categoryMap.set(dua.category_id, {
          title: dua.category_title,
          icon: dua.category_icon,
          color: dua.category_color,
          count: 0,
        });
      }
      const category = categoryMap.get(dua.category_id)!;
      category.count++;
    });

    return Array.from(categoryMap.entries()).map(([id, data]) => ({
      id,
      ...data,
    }));
  };

  const getCategoryDuas = (categoryId: string) => {
    return duas.filter(d => d.category_id === categoryId);
  };

  if (selectedDua) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: 48 }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedDua(null)}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.backText, { color: colors.primary }]}>
              Back
            </Text>
          </TouchableOpacity>

          <View style={[styles.duaCard, isDark && styles.cardDark]}>
            <Text style={[styles.sectionLabel, isDark && styles.textDark]}>
              Arabic
            </Text>
            <Text style={[styles.arabicText, isDark && styles.textDark]}>
              {selectedDua.arabic}
            </Text>
          </View>

          <View style={[styles.duaCard, isDark && styles.cardDark]}>
            <Text style={[styles.sectionLabel, isDark && styles.textDark]}>
              Transliteration
            </Text>
            <Text style={[styles.transliterationText, isDark && styles.textSecondaryDark]}>
              {selectedDua.transliteration}
            </Text>
          </View>

          <View style={[styles.duaCard, isDark && styles.cardDark]}>
            <Text style={[styles.sectionLabel, isDark && styles.textDark]}>
              Translation
            </Text>
            <Text style={[styles.translationText, isDark && styles.textSecondaryDark]}>
              {selectedDua.translation}
            </Text>
          </View>

          {selectedDua.reference && (
            <View style={[styles.duaCard, isDark && styles.cardDark]}>
              <Text style={[styles.sectionLabel, isDark && styles.textDark]}>
                Reference
              </Text>
              <Text style={[styles.referenceText, { color: colors.primary }]}>
                {selectedDua.reference}
              </Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  if (selectedCategory) {
    const categoryDuas = getCategoryDuas(selectedCategory);
    const category = getCategories().find(c => c.id === selectedCategory);

    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: 48 }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedCategory(null)}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.backText, { color: colors.primary }]}>
              Back
            </Text>
          </TouchableOpacity>

          <Text style={[styles.categoryTitle, isDark && styles.textDark]}>
            {category?.title}
          </Text>

          {categoryDuas.length > 0 ? (
            categoryDuas.map((dua, index) => (
              <TouchableOpacity
                key={`dua-${dua.id}-${index}`}
                style={[styles.duaListCard, isDark && styles.cardDark]}
                onPress={() => setSelectedDua(dua)}
                activeOpacity={0.7}
              >
                <View style={styles.duaListContent}>
                  <Text style={[styles.duaListArabic, isDark && styles.textDark]} numberOfLines={1}>
                    {dua.arabic}
                  </Text>
                  <Text style={[styles.duaListTranslation, isDark && styles.textSecondaryDark]} numberOfLines={2}>
                    {dua.translation}
                  </Text>
                </View>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron_right"
                  size={20}
                  color={isDark ? colors.textSecondaryDark : colors.textSecondary}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
              No duas available in this category
            </Text>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  const categories = getCategories();

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: 48 }]}
    >
      <Text style={[styles.title, isDark && styles.textDark]}>
        Duas
      </Text>
      <Text style={[styles.subtitle, isDark && styles.textSecondaryDark]}>
        Supplications for every occasion
      </Text>

      {categories.length > 0 ? (
        categories.map((category, index) => (
          <TouchableOpacity
            key={`category-${category.id}-${index}`}
            style={[styles.categoryCard, isDark && styles.cardDark]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
              <IconSymbol
                ios_icon_name="hands.sparkles.fill"
                android_material_icon_name="volunteer_activism"
                size={32}
                color={category.color}
              />
            </View>
            <View style={styles.categoryContent}>
              <Text style={[styles.categoryCardTitle, isDark && styles.textDark]}>
                {category.title}
              </Text>
              <Text style={[styles.categoryCount, isDark && styles.textSecondaryDark]}>
                {category.count} duas
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={isDark ? colors.textSecondaryDark : colors.textSecondary}
            />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
          No duas available
        </Text>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: colors.backgroundDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  cardDark: {
    backgroundColor: colors.surfaceDark,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryContent: {
    flex: 1,
  },
  categoryCardTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  categoryCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backText: {
    ...typography.body,
    marginLeft: spacing.xs,
  },
  categoryTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  duaListCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  duaListContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  duaListArabic: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  duaListTranslation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  duaCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  arabicText: {
    ...typography.h4,
    color: colors.text,
    textAlign: 'right',
    lineHeight: 32,
  },
  transliterationText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  translationText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  referenceText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  textDark: {
    color: colors.textDark,
  },
  textSecondaryDark: {
    color: colors.textSecondaryDark,
  },
});
