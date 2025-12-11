
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { colors } from '../styles/commonStyles';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? colors.backgroundDark : colors.background,
        },
        headerTintColor: isDark ? colors.textDark : colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: isDark ? colors.backgroundDark : colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
