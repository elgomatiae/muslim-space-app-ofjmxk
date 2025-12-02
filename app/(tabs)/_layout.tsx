
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import FloatingTabBar from '@/components/FloatingTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="house.fill"
              android_material_icon_name="home"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="play.rectangle.fill"
              android_material_icon_name="play-circle-filled"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dawah"
        options={{
          title: 'Dawah',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wellness"
        options={{
          title: 'Wellness',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="heart.fill"
              android_material_icon_name="favorite"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="chart.pie.fill"
              android_material_icon_name="pie-chart"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: 'Trends',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="chart.line.uptrend.xyaxis"
              android_material_icon_name="show-chart"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: 'Duas',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="hands.sparkles.fill"
              android_material_icon_name="auto-awesome"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="questionmark.circle.fill"
              android_material_icon_name="quiz"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
