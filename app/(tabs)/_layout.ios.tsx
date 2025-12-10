
import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor={colors.card}
      tintColor={colors.primary}
      iconColor={colors.textSecondary}
      labelStyle={{ color: colors.text }}
    >
      <NativeTabs.Trigger name="(home)">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="learning">
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Learn</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="dawah">
        <Icon sf={{ default: 'star', selected: 'star.fill' }} />
        <Label>Dawah</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="tracker">
        <Icon sf={{ default: 'chart.line.uptrend.xyaxis', selected: 'chart.line.uptrend.xyaxis.circle.fill' }} />
        <Label>Faith</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="wellness">
        <Icon sf={{ default: 'heart', selected: 'heart.fill' }} />
        <Label>Wellness</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
