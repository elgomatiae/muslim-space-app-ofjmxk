
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Dimensions, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/lib/supabase';

const { height } = Dimensions.get('window');

interface QuranVerse {
  surah: number;
  verse: number;
  arabic: string;
  translation: string;
  order_index: number;
}

interface Hadith {
  source: string;
  text: string;
  order_index: number;
}

interface Miracle {
  id: string;
  category_id: string;
  title: string;
  description: string;
  details: string;
  explanation: string;
  reference: string;
  image_url: string;
  order_index: number;
  quran_verses: QuranVerse[];
  hadiths: Hadith[];
}

interface MiracleCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
}

const miracleCategories: MiracleCategory[] = [
  { id: 'scientific', title: 'Scientific', icon: 'flask', color: '#3F51B5' },
  { id: 'linguistic', title: 'Linguistic', icon: 'text-format', color: '#E91E63' },
  { id: 'historical', title: 'Historical', icon: 'history', color: '#03A9F4' },
  { id: 'mathematical', title: 'Mathematical', icon: 'calculate', color: '#FF9800' },
  { id: 'prophetic', title: 'Prophetic', icon: 'star', color: '#9C27B0' },
];

const dawahTips = [
  'Start with common ground and shared values',
  'Listen actively and show genuine interest',
  'Use clear examples and relatable stories',
  'Be patient and respectful at all times',
  'Focus on the beauty and wisdom of Islam',
  'Share personal experiences and transformations',
  'Use these miracles as conversation starters',
  'Always maintain good character - it\'s the best Dawah',
];

export default function DawahScreen() {
  const [selectedTab, setSelectedTab] = useState('scientific');
  const [expandedMiracle, setExpandedMiracle] = useState<string | null>(null);
  const [miracles, setMiracles] = useState<Miracle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMiracles();
  }, [selectedTab]);

  const fetchMiracles = async () => {
    try {
      setLoading(true);
      
      const { data: miraclesData, error: miraclesError } = await supabase
        .from('miracles')
        .select('*')
        .eq('category_id', selectedTab)
        .order('order_index', { ascending: true });

      if (miraclesError) throw miraclesError;

      if (miraclesData) {
        const miraclesWithDetails = await Promise.all(
          miraclesData.map(async (miracle) => {
            const { data: verses } = await supabase
              .from('miracle_quran_verses')
              .select('*')
              .eq('miracle_id', miracle.id)
              .order('order_index', { ascending: true });

            const { data: hadiths } = await supabase
              .from('miracle_hadiths')
              .select('*')
              .eq('miracle_id', miracle.id)
              .order('order_index', { ascending: true });

            return {
              ...miracle,
              quran_verses: verses || [],
              hadiths: hadiths || [],
            };
          })
        );

        setMiracles(miraclesWithDetails);
      }
    } catch (error) {
      console.error('Error fetching miracles:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = miracleCategories.find(cat => cat.id === selectedTab);

  const toggleMiracle = (miracleId: string) => {
    setExpandedMiracle(expandedMiracle === miracleId ? null : miracleId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dawah Resources</Text>
        <Text style={styles.headerSubtitle}>Share Islam with confidence</Text>
      </View>

      <View style={[styles.tabsContainer, { maxHeight: height * 0.25 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {miracleCategories.map((category) => (
            <TouchableOpacity
              key={`miracle-category-${category.id}`}
              style={[
                styles.tabButton,
                selectedTab === category.id && styles.tabButtonActive,
                { borderColor: category.color },
                selectedTab === category.id && { backgroundColor: category.color },
              ]}
              onPress={() => {
                setSelectedTab(category.id);
                setExpandedMiracle(null);
              }}
            >
              <IconSymbol
                ios_icon_name={category.icon as any}
                android_material_icon_name={category.icon as any}
                size={14}
                color={selectedTab === category.id ? colors.card : category.color}
              />
              <Text style={[
                styles.tabButtonText,
                selectedTab === category.id && styles.tabButtonTextActive,
                { color: selectedTab === category.id ? colors.card : category.color }
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedCategory && (
          <View key={`category-content-${selectedCategory.id}`}>
            <View style={[styles.categoryHeader, { backgroundColor: selectedCategory.color }]}>
              <IconSymbol
                ios_icon_name={selectedCategory.icon as any}
                android_material_icon_name={selectedCategory.icon as any}
                size={24}
                color={colors.card}
              />
              <View style={styles.categoryHeaderText}>
                <Text style={styles.categoryHeaderTitle}>{selectedCategory.title} Miracles</Text>
                <Text style={styles.categoryHeaderSubtitle}>
                  {miracles.length} miracles
                </Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={selectedCategory.color} />
                <Text style={styles.loadingText}>Loading miracles...</Text>
              </View>
            ) : (
              <View style={styles.miraclesGrid}>
                {miracles.map((miracle) => {
                  const isExpanded = expandedMiracle === miracle.id;
                  return (
                    <TouchableOpacity
                      key={`miracle-${miracle.id}`}
                      style={styles.miracleCard}
                      onPress={() => toggleMiracle(miracle.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.miracleImageContainer}>
                        <Image
                          source={{ uri: miracle.image_url }}
                          style={styles.miracleImage}
                          resizeMode="cover"
                        />
                        <View style={[styles.miracleNumber, { backgroundColor: selectedCategory.color }]}>
                          <Text style={styles.miracleNumberText}>{miracle.order_index + 1}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.miracleContent}>
                        <Text style={styles.miracleTitle} numberOfLines={isExpanded ? undefined : 2}>
                          {miracle.title}
                        </Text>
                        
                        <Text style={styles.miracleDescription} numberOfLines={isExpanded ? undefined : 3}>
                          {miracle.description}
                        </Text>
                        
                        {isExpanded && (
                          <View key={`miracle-expanded-${miracle.id}`}>
                            {miracle.quran_verses && miracle.quran_verses.length > 0 && (
                              <View key={`verses-section-${miracle.id}`}>
                                <View style={styles.divider} />
                                <View style={styles.section}>
                                  <View style={[styles.sectionHeaderProminent, { backgroundColor: selectedCategory.color }]}>
                                    <IconSymbol
                                      ios_icon_name="book.fill"
                                      android_material_icon_name="menu-book"
                                      size={20}
                                      color={colors.card}
                                    />
                                    <Text style={styles.sectionTitleProminent}>
                                      Quranic Evidence
                                    </Text>
                                  </View>
                                  {miracle.quran_verses.map((verse, verseIndex) => (
                                    <View key={`verse-${miracle.id}-${verseIndex}`} style={[styles.verseContainerProminent, { borderLeftColor: selectedCategory.color }]}>
                                      <View style={[styles.verseReference, { backgroundColor: selectedCategory.color }]}>
                                        <IconSymbol
                                          ios_icon_name="book.closed.fill"
                                          android_material_icon_name="auto-stories"
                                          size={14}
                                          color={colors.card}
                                        />
                                        <Text style={styles.verseReferenceText}>
                                          Surah {verse.surah}:{verse.verse}
                                        </Text>
                                      </View>
                                      {verse.arabic && (
                                        <View style={styles.verseArabicContainer}>
                                          <Text style={styles.verseArabic}>{verse.arabic}</Text>
                                        </View>
                                      )}
                                      <Text style={styles.verseTranslation}>{verse.translation}</Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}

                            <View style={styles.divider} />
                            <View style={styles.section}>
                              <View style={styles.sectionHeader}>
                                <IconSymbol
                                  ios_icon_name="doc.text.fill"
                                  android_material_icon_name="description"
                                  size={18}
                                  color={selectedCategory.color}
                                />
                                <Text style={[styles.sectionTitle, { color: selectedCategory.color }]}>
                                  The Miracle Explained
                                </Text>
                              </View>
                              <Text style={styles.miracleDetails}>{miracle.details}</Text>
                            </View>

                            {miracle.explanation && (
                              <View key={`explanation-section-${miracle.id}`}>
                                <View style={styles.divider} />
                                <View style={styles.section}>
                                  <View style={styles.sectionHeader}>
                                    <IconSymbol
                                      ios_icon_name="lightbulb.fill"
                                      android_material_icon_name="lightbulb"
                                      size={18}
                                      color={selectedCategory.color}
                                    />
                                    <Text style={[styles.sectionTitle, { color: selectedCategory.color }]}>
                                      Why This Is Miraculous
                                    </Text>
                                  </View>
                                  <Text style={styles.miracleDetails}>{miracle.explanation}</Text>
                                </View>
                              </View>
                            )}

                            {miracle.hadiths && miracle.hadiths.length > 0 && (
                              <View key={`hadiths-section-${miracle.id}`}>
                                <View style={styles.divider} />
                                <View style={styles.section}>
                                  <View style={styles.sectionHeader}>
                                    <IconSymbol
                                      ios_icon_name="text.book.closed.fill"
                                      android_material_icon_name="auto-stories"
                                      size={18}
                                      color={selectedCategory.color}
                                    />
                                    <Text style={[styles.sectionTitle, { color: selectedCategory.color }]}>
                                      Supporting Hadiths
                                    </Text>
                                  </View>
                                  {miracle.hadiths.map((hadith, hadithIndex) => (
                                    <View key={`hadith-${miracle.id}-${hadithIndex}`} style={[styles.hadithContainer, { borderLeftColor: selectedCategory.color }]}>
                                      <View style={[styles.hadithSource, { backgroundColor: selectedCategory.color }]}>
                                        <Text style={styles.hadithSourceText}>{hadith.source}</Text>
                                      </View>
                                      <Text style={styles.hadithText}>{hadith.text}</Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}

                            <View style={styles.miracleFooter}>
                              <IconSymbol
                                ios_icon_name="link"
                                android_material_icon_name="link"
                                size={14}
                                color={selectedCategory.color}
                              />
                              <Text style={[styles.miracleReference, { color: selectedCategory.color }]}>
                                {miracle.reference}
                              </Text>
                            </View>
                          </View>
                        )}

                        <View style={styles.expandButton}>
                          <Text style={[styles.expandButtonText, { color: selectedCategory.color }]}>
                            {isExpanded ? 'Show Less' : 'Read More'}
                          </Text>
                          <IconSymbol
                            ios_icon_name={isExpanded ? 'chevron.up' : 'chevron.down'}
                            android_material_icon_name={isExpanded ? 'expand-less' : 'expand-more'}
                            size={16}
                            color={selectedCategory.color}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <IconSymbol
              ios_icon_name="lightbulb.fill"
              android_material_icon_name="lightbulb"
              size={24}
              color={colors.card}
            />
            <Text style={styles.tipsTitle}>Quick Dawah Tips</Text>
          </View>
          <View style={styles.tipsList}>
            {dawahTips.map((tip, index) => (
              <View key={`dawah-tip-${index}`} style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabsContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsScroll: {
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    marginRight: 8,
    gap: 6,
  },
  tabButtonActive: {
    borderWidth: 1.5,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.12)',
    elevation: 3,
  },
  categoryHeaderText: {
    flex: 1,
  },
  categoryHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 2,
  },
  categoryHeaderSubtitle: {
    fontSize: 13,
    color: colors.card,
    opacity: 0.9,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  miraclesGrid: {
    gap: 12,
  },
  miracleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  miracleImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  miracleImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  miracleNumber: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  miracleNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  miracleContent: {
    padding: 16,
  },
  miracleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  miracleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeaderProminent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  sectionTitleProminent: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.card,
  },
  miracleDetails: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  verseContainerProminent: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  verseReference: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  verseReferenceText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.card,
  },
  verseArabicContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  verseArabic: {
    fontSize: 20,
    color: colors.text,
    lineHeight: 36,
    textAlign: 'right',
    fontWeight: '600',
  },
  verseTranslation: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  hadithContainer: {
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  hadithSource: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  hadithSourceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
  },
  hadithText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  miracleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 12,
    gap: 6,
  },
  miracleReference: {
    fontSize: 13,
    fontWeight: '600',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
    gap: 4,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    boxShadow: '0px 3px 10px rgba(63, 81, 181, 0.25)',
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.card,
    marginTop: 7,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
  },
});
