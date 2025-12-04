
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  console.log('🍎 iOS TabLayout rendering - Profile tab should be visible');
  
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
      <NativeTabs.Trigger key="wellness" name="wellness">
        <Icon sf={{ default: 'heart', selected: 'heart.fill' }} />
        <Label>Wellness</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="tracker" name="tracker">
        <Icon sf={{ default: 'chart.line.uptrend.xyaxis', selected: 'chart.line.uptrend.xyaxis.circle.fill' }} />
        <Label>Faith</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf={{ default: 'person.circle', selected: 'person.circle.fill' }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
