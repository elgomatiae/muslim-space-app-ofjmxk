
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  console.log('🔄 Android/Web TabLayout rendering - Profile tab should be visible');
  
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
      icon: 'trending-up',
      label: 'Faith',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  console.log('📋 Tab configuration:', tabs.map(t => t.label).join(', '));

  return (
    <React.Fragment>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="learning" />
        <Stack.Screen name="dawah" />
        <Stack.Screen name="tracker" />
        <Stack.Screen name="duas" />
        <Stack.Screen name="wellness" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="achievements" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="trends" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </React.Fragment>
  );
}
