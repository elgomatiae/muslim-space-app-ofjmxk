
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: Platform.OS === 'android' ? 60 : 85,
          paddingBottom: Platform.OS === 'android' ? 8 : 25,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              ios_icon_name={focused ? 'house.fill' : 'house'}
              android_material_icon_name="home"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              ios_icon_name={focused ? 'book.fill' : 'book'}
              android_material_icon_name="school"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dawah"
        options={{
          title: 'Dawah',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              ios_icon_name={focused ? 'star.fill' : 'star'}
              android_material_icon_name="star"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Faith',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              ios_icon_name={focused ? 'chart.line.uptrend.xyaxis.circle.fill' : 'chart.line.uptrend.xyaxis'}
              android_material_icon_name="trending-up"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              ios_icon_name={focused ? 'person.circle.fill' : 'person.circle'}
              android_material_icon_name="person"
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      {/* Hidden screens - accessible from other tabs */}
      <Tabs.Screen
        name="wellness"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
