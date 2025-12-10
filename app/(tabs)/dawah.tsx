
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

interface Miracle {
  id: string;
  category_id: string;
  title: string;
  description: string;
  details: string;
  explanation: string;
  reference: string;
}

const categories = [
  { id: 'scientific', title: 'Scientific Miracles', icon: 'atom', color: colors.info },
  { id: 'linguistic', title: 'Linguistic Miracles', icon: 'text.quote', color: colors.secondary },
  { id: 'historical', title: 'Historical Miracles', icon: 'clock.arrow.circlepath', color: colors.warning },
  { id: 'mathematical', title: 'Mathematical Miracles', icon: 'number', color: colors.success },
];

export default function DawahScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [miracles, setMiracles] = useState<Miracle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMiracle, setSelectedMiracle] = useState<Miracle | null>(null);

  useEffect(() => {
    loadMiracles();
  }, []);

  const loadMiracles = async () => {
    try {
      const { data, error } = await supabase
        .from('miracles')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error loading miracles:', error);
      } else {
        setMiracles(data || []);
      }
    } catch (error) {
      console.error('Error loading miracles:', error);
    }
  };

  const getCategoryMiracles = (categoryId: string) => {
    return miracles.filter(m => m.category_id === categoryId);
  };

  if (selectedMiracle) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: 48 }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedMiracle(null)}
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

          <Text style={[styles.miracleTitle, isDark && styles.textDark]}>
            {selectedMiracle.title}
          </Text>

          <View style={[styles.miracleCard, isDark && styles.cardDark]}>
            <Text style={[styles.sectionLabel, isDark && styles.textDark]}>
              Description
            </Text>
            <Text style={[styles.miracleText, isDark && styles.textSecondaryDark]}>
              {selectedMiracle.description}
            </Text>
          </View>

          <View style={[styles.miracleCard, isDark && styles.cardDark]}>
            <Text style={[styles.sectionLabel, isDark && styles.textDark]}>
              Details
            </Text>
            <Text style={[styles.miracleText, isDark && styles.textSecondaryDark]}>
              {selectedMiracle.details}
            </Text>
          </View>

          <View style={[styles.miracleCard, isDark && styles.cardDark]}>
            <Text style={[styles.sectionLabel, isDark && styles.textDark]}>
              Explanation
            </Text>
            <Text style={[styles.miracleText, isDark && styles.textSecondaryDark]}>
              {selectedMiracle.explanation}
            </Text>
          </View>

          {selectedMiracle.reference && (
            <View style={[styles.miracleCard, isDark && styles.cardDark]}>
              <Text style={[styles.sectionLabel, isDark && styles.textDark]}>
                Reference
              </Text>
              <Text style={[styles.referenceText, { color: colors.primary }]}>
                {selectedMiracle.reference}
              </Text>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    );
  }

  if (selectedCategory) {
    const categoryMiracles = getCategoryMiracles(selectedCategory);
    const category = categories.find(c => c.id === selectedCategory);

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

          {categoryMiracles.length > 0 ? (
            <View>
              {categoryMiracles.map((miracle, index) => (
                <TouchableOpacity
                  key={`miracle-${miracle.id}-${index}`}
                  style={[styles.miracleListCard, isDark && styles.cardDark]}
                  onPress={() => setSelectedMiracle(miracle)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.miracleListTitle, isDark && styles.textDark]}>
                    {miracle.title}
                  </Text>
                  <Text style={[styles.miracleListDescription, isDark && styles.textSecondaryDark]} numberOfLines={2}>
                    {miracle.description}
                  </Text>
                  <IconSymbol
                    ios_icon_name="chevron.right"
                    android_material_icon_name="chevron_right"
                    size={20}
                    color={isDark ? colors.textSecondaryDark : colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
              No miracles available in this category
            </Text>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: 48 }]}
    >
      <Text style={[styles.title, isDark && styles.textDark]}>
        Dawah Resources
      </Text>
      <Text style={[styles.subtitle, isDark && styles.textSecondaryDark]}>
        Explore the miracles of Islam
      </Text>

      <View>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={`category-${category.id}-${index}`}
            style={[styles.categoryCard, isDark && styles.cardDark]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
              <IconSymbol
                ios_icon_name={category.icon}
                android_material_icon_name="star"
                size={32}
                color={category.color}
              />
            </View>
            <View style={styles.categoryContent}>
              <Text style={[styles.categoryCardTitle, isDark && styles.textDark]}>
                {category.title}
              </Text>
              <Text style={[styles.categoryCount, isDark && styles.textSecondaryDark]}>
                {getCategoryMiracles(category.id).length} miracles
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={isDark ? colors.textSecondaryDark : colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomSpacer} />
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
  miracleListCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  miracleListTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  miracleListDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  miracleTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  miracleCard: {
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
  miracleText: {
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
  bottomSpacer: {
    height: 100,
  },
  textDark: {
    color: colors.textDark,
  },
  textSecondaryDark: {
    color: colors.textSecondaryDark,
  },
});
