
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'learning',
      route: '/(tabs)/learning',
      icon: 'school',
      label: 'Learn',
    },
    {
      name: 'dawah',
      route: '/(tabs)/dawah',
      icon: 'star',
      label: 'Dawah',
    },
    {
      name: 'wellness',
      route: '/(tabs)/wellness',
      icon: 'favorite',
      label: 'Wellness',
    },
    {
      name: 'tracker',
      route: '/(tabs)/tracker',
      icon: 'bar-chart',
      label: 'Track',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="learning" name="learning" />
        <Stack.Screen key="dawah" name="dawah" />
        <Stack.Screen key="tracker" name="tracker" />
        <Stack.Screen key="duas" name="duas" />
        <Stack.Screen key="wellness" name="wellness" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
