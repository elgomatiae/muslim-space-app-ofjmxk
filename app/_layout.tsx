
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { colors } from '../styles/commonStyles';
import { AuthProvider } from '../contexts/AuthContext';
import { TrackerProvider } from '../contexts/TrackerContext';
import { AchievementProvider } from '../contexts/AchievementContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { WidgetProvider } from '../contexts/WidgetContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <AuthProvider>
      <NotificationProvider>
        <TrackerProvider>
          <AchievementProvider>
            <WidgetProvider>
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
                <Stack.Screen name="email-verification" options={{ title: 'Email Verification' }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                <Stack.Screen name="transparent-modal" options={{ presentation: 'transparentModal', title: 'Transparent Modal' }} />
                <Stack.Screen name="formsheet" options={{ presentation: 'formSheet', title: 'Form Sheet' }} />
              </Stack>
            </WidgetProvider>
          </AchievementProvider>
        </TrackerProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
