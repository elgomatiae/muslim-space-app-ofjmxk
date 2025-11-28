
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
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
              size={18}
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

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedCategory && (
          <React.Fragment>
            <View style={[styles.categoryBanner, { backgroundColor: selectedCategory.color }]}>
              <IconSymbol
                ios_icon_name={selectedCategory.icon as any}
                android_material_icon_name={selectedCategory.icon as any}
                size={32}
                color={colors.card}
              />
              <View style={styles.categoryBannerText}>
                <Text style={styles.categoryBannerTitle}>{selectedCategory.title} Miracles</Text>
                <Text style={styles.categoryBannerSubtitle}>
                  {selectedCategory.miracles.length} miracles to explore
                </Text>
              </View>
            </View>

            <View style={styles.miraclesGrid}>
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
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: miracle.image }}
                      style={styles.miracleImage}
                      resizeMode="cover"
                    />
                    <View style={styles.miracleContent}>
                      <View style={styles.miracleHeader}>
                        <View style={[styles.miracleNumber, { backgroundColor: selectedCategory.color }]}>
                          <Text style={styles.miracleNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.miracleTitle} numberOfLines={isExpanded ? undefined : 2}>
                          {miracle.title}
                        </Text>
                      </View>
                      
                      {!isExpanded && (
                        <Text style={styles.miracleDescription} numberOfLines={3}>
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

                      <View style={styles.expandButton}>
                        <IconSymbol
                          ios_icon_name={isExpanded ? 'chevron.up' : 'chevron.down'}
                          android_material_icon_name={isExpanded ? 'expand-less' : 'expand-more'}
                          size={20}
                          color={selectedCategory.color}
                        />
                        <Text style={[styles.expandButtonText, { color: selectedCategory.color }]}>
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </React.Fragment>
        )}

        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <IconSymbol
              ios_icon_name="lightbulb.fill"
              android_material_icon_name="lightbulb"
              size={28}
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
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Share personal experiences and transformations</Text>
            </View>
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
    paddingBottom: 20,
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
    fontSize: 15,
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
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 2,
    marginRight: 8,
    gap: 6,
  },
  tabButtonActive: {
    borderWidth: 2,
  },
  tabButtonText: {
    fontSize: 14,
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
  categoryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  categoryBannerText: {
    flex: 1,
  },
  categoryBannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 4,
  },
  categoryBannerSubtitle: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
  },
  miraclesGrid: {
    gap: 16,
  },
  miracleCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  miracleCardExpanded: {
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
    elevation: 6,
  },
  miracleImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.border,
  },
  miracleContent: {
    padding: 16,
  },
  miracleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  miracleNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  miracleNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  miracleTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
  },
  miracleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
  },
  miracleDescriptionFull: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
    marginBottom: 16,
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  miracleDetails: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  miracleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 12,
  },
  miracleReference: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(63, 81, 181, 0.3)',
    elevation: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  tipsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.card,
  },
  tipsList: {
    gap: 14,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.card,
    marginTop: 7,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: colors.card,
    lineHeight: 22,
  },
});
