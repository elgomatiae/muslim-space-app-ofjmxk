
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { colors } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textSecondaryDark : colors.textSecondary,
        tabBarStyle: {
          backgroundColor: isDark ? colors.surfaceDark : colors.surface,
          borderTopColor: isDark ? colors.surfaceDark : colors.surface,
        },
        headerStyle: {
          backgroundColor: isDark ? colors.backgroundDark : colors.background,
        },
        headerTintColor: isDark ? colors.textDark : colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="house.fill" android_material_icon_name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="chart.bar.fill" android_material_icon_name="bar_chart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="play.rectangle.fill" android_material_icon_name="play_circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dawah"
        options={{
          title: 'Dawah',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: 'Duas',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="hands.sparkles.fill" android_material_icon_name="volunteer_activism" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
