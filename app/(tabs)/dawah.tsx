
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { miracleCategories } from '@/data/miracles';

export default function DawahScreen() {
  const [selectedTab, setSelectedTab] = useState('scientific');
  const [expandedMiracle, setExpandedMiracle] = useState<string | null>(null);

  const selectedCategory = miracleCategories.find(cat => cat.id === selectedTab);

  const toggleMiracle = (miracleId: string) => {
    setExpandedMiracle(expandedMiracle === miracleId ? null : miracleId);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2FsbGlncmFwaHkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48dGV4dCB4PSI1MCIgeT0iMTAwIiBmb250LXNpemU9IjgwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtinINmE2YTZhzwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjI1MCIgZm9udC1zaXplPSI2MCIgb3BhY2l0eT0iMC4wMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmaWxsPSIjMDAwMDAwIj7Yp9mE2K3ZhdivINmE2YTZhzwvdGV4dD48dGV4dCB4PSI1MCIgeT0iMzUwIiBmb250LXNpemU9IjcwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtiz2KjYrdin2YY8L3RleHQ+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNjYWxsaWdyYXBoeSkiLz48L3N2Zz4=' }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dawah Resources</Text>
          <Text style={styles.headerSubtitle}>Share Islam with confidence</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {miracleCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabChip,
                selectedTab === category.id && styles.tabChipActive,
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
                size={20}
                color={selectedTab === category.id ? colors.card : category.color}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {selectedCategory && (
            <React.Fragment>
              <View style={[styles.categoryHeader, { backgroundColor: selectedCategory.color }]}>
                <IconSymbol
                  ios_icon_name={selectedCategory.icon as any}
                  android_material_icon_name={selectedCategory.icon as any}
                  size={28}
                  color={colors.card}
                />
                <View style={styles.categoryHeaderText}>
                  <Text style={styles.categoryTitle}>{selectedCategory.title} Miracles</Text>
                  <Text style={styles.categoryCount}>
                    {selectedCategory.miracles.length} miracles to explore
                  </Text>
                </View>
              </View>

              {selectedCategory.miracles.map((miracle, index) => {
                const isExpanded = expandedMiracle === miracle.id;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.miracleCard,
                      isExpanded && styles.miracleCardExpanded,
                    ]}
                    onPress={() => toggleMiracle(miracle.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.miracleHeader}>
                      <View style={[styles.miracleNumber, { backgroundColor: selectedCategory.color }]}>
                        <Text style={styles.miracleNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.miracleTitle}>{miracle.title}</Text>
                      <IconSymbol
                        ios_icon_name={isExpanded ? 'chevron.up.circle.fill' : 'chevron.down.circle'}
                        android_material_icon_name={isExpanded ? 'expand-less' : 'expand-more'}
                        size={28}
                        color={selectedCategory.color}
                      />
                    </View>
                    
                    {!isExpanded && (
                      <Text style={styles.miracleDescription} numberOfLines={2}>
                        {miracle.description}
                      </Text>
                    )}
                    
                    {isExpanded && (
                      <React.Fragment>
                        <View style={styles.expandedContent}>
                          <Text style={styles.miracleDescriptionFull}>{miracle.description}</Text>
                          <View style={styles.divider} />
                          <Text style={styles.miracleDetails}>{miracle.details}</Text>
                          <View style={styles.miracleFooter}>
                            <IconSymbol
                              ios_icon_name="book.fill"
                              android_material_icon_name="menu-book"
                              size={18}
                              color={selectedCategory.color}
                            />
                            <Text style={[styles.miracleReference, { color: selectedCategory.color }]}>
                              {miracle.reference}
                            </Text>
                          </View>
                        </View>
                      </React.Fragment>
                    )}
                  </TouchableOpacity>
                );
              })}
            </React.Fragment>
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
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Start with common ground and shared values</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Listen actively and show genuine interest</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Use clear examples and relatable stories</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Be patient and respectful at all times</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>Focus on the beauty and wisdom of Islam</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabsScroll: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabChip: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    borderWidth: 2,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  tabChipActive: {
    borderWidth: 3,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
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
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  categoryHeaderText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 13,
    color: colors.card,
    opacity: 0.9,
  },
  miracleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  miracleCardExpanded: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
    elevation: 4,
  },
  miracleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  miracleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  miracleNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.card,
  },
  miracleTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  miracleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  miracleDescriptionFull: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  miracleDetails: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  miracleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  miracleReference: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  tipsCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(63, 81, 181, 0.3)',
    elevation: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 20,
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
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
  },
});
