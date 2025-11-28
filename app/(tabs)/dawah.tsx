
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { miracleCategories } from '@/data/miracles';

export default function DawahScreen() {
  const [selectedTab, setSelectedTab] = useState('scientific');

  const selectedCategory = miracleCategories.find(cat => cat.id === selectedTab);

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
              styles.tabChip,
              selectedTab === category.id && styles.tabChipActive,
              { borderColor: category.color },
              selectedTab === category.id && { backgroundColor: category.color },
            ]}
            onPress={() => setSelectedTab(category.id)}
          >
            <IconSymbol
              ios_icon_name={category.icon as any}
              android_material_icon_name={category.icon as any}
              size={18}
              color={selectedTab === category.id ? colors.card : category.color}
            />
            <Text
              style={[
                styles.tabChipText,
                { color: selectedTab === category.id ? colors.card : category.color },
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedCategory && (
          <React.Fragment>
            <View style={styles.introCard}>
              <View style={[styles.introIcon, { backgroundColor: selectedCategory.color }]}>
                <IconSymbol
                  ios_icon_name={selectedCategory.icon as any}
                  android_material_icon_name={selectedCategory.icon as any}
                  size={32}
                  color={colors.card}
                />
              </View>
              <Text style={styles.introTitle}>{selectedCategory.title} Miracles</Text>
              <Text style={styles.introSubtitle}>
                {selectedCategory.miracles.length} miracles to explore
              </Text>
            </View>

            {selectedCategory.miracles.map((miracle, index) => (
              <View key={index} style={styles.miracleCard}>
                <View style={styles.miracleHeader}>
                  <View style={[styles.miracleNumber, { backgroundColor: selectedCategory.color }]}>
                    <Text style={styles.miracleNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.miracleTitle}>{miracle.title}</Text>
                </View>
                <Text style={styles.miracleDescription}>{miracle.description}</Text>
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
              </View>
            ))}
          </React.Fragment>
        )}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Quick Dawah Tips</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 2,
    marginRight: 8,
    gap: 6,
  },
  tabChipActive: {
    borderWidth: 2,
  },
  tabChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  introCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  introSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  miracleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
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
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  miracleDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
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
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 16,
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
