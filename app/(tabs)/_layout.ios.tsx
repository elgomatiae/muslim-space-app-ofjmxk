
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={colors.primary}
      iconColor={colors.textSecondary}
      labelStyle={{ color: colors.text }}
    >
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="learning" name="learning">
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Learning</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="dawah" name="dawah">
        <Icon sf={{ default: 'star', selected: 'star.fill' }} />
        <Label>Dawah</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="tracker" name="tracker">
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <Label>Tracker</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="duas" name="duas">
        <Icon sf={{ default: 'hands.sparkles', selected: 'hands.sparkles.fill' }} />
        <Label>Duas</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
