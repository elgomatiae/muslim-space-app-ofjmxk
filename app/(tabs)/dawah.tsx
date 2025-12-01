
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { miracleCategories } from '@/data/miracles';

const { height } = Dimensions.get('window');

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

      <View style={[styles.tabsContainer, { maxHeight: height * 0.25 }]}>
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
          <React.Fragment>
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
                  {selectedCategory.miracles.length} miracles
                </Text>
              </View>
            </View>

            <View style={styles.miraclesGrid}>
              {selectedCategory.miracles.map((miracle, index) => {
                const isExpanded = expandedMiracle === miracle.id;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.miracleCard}
                    onPress={() => toggleMiracle(miracle.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.miracleImageContainer}>
                      <Image
                        source={{ uri: miracle.image }}
                        style={styles.miracleImage}
                        resizeMode="cover"
                      />
                      <View style={[styles.miracleNumber, { backgroundColor: selectedCategory.color }]}>
                        <Text style={styles.miracleNumberText}>{index + 1}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.miracleContent}>
                      <Text style={styles.miracleTitle} numberOfLines={isExpanded ? undefined : 2}>
                        {miracle.title}
                      </Text>
                      
                      <Text style={styles.miracleDescription} numberOfLines={isExpanded ? undefined : 2}>
                        {miracle.description}
                      </Text>
                      
                      {isExpanded && (
                        <React.Fragment>
                          <View style={styles.divider} />
                          <Text style={styles.miracleDetails}>{miracle.details}</Text>
                          <View style={styles.miracleFooter}>
                            <IconSymbol
                              ios_icon_name="book.fill"
                              android_material_icon_name="menu-book"
                              size={14}
                              color={selectedCategory.color}
                            />
                            <Text style={[styles.miracleReference, { color: selectedCategory.color }]}>
                              {miracle.reference}
                            </Text>
                          </View>
                        </React.Fragment>
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
            {[
              'Start with common ground and shared values',
              'Listen actively and show genuine interest',
              'Use clear examples and relatable stories',
              'Be patient and respectful at all times',
              'Focus on the beauty and wisdom of Islam',
              'Share personal experiences and transformations',
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
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
    height: 140,
  },
  miracleImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  miracleNumber: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  miracleNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.card,
  },
  miracleContent: {
    padding: 14,
  },
  miracleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  miracleDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  miracleDetails: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  miracleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 8,
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
    paddingVertical: 6,
    gap: 4,
  },
  expandButtonText: {
    fontSize: 13,
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
    marginTop: 6,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
  },
});
