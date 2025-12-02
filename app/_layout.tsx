
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { TrackerProvider } from '@/contexts/TrackerContext';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { AchievementProvider } from '@/contexts/AchievementContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { colors } from '@/styles/commonStyles';

export default function RootLayout() {
  useEffect(() => {
    setBackgroundColorAsync(colors.background);
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <TrackerProvider>
          <AchievementProvider>
            <WidgetProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'none',
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="transparent-modal"
                  options={{
                    presentation: 'transparentModal',
                    animation: 'fade',
                  }}
                />
                <Stack.Screen
                  name="formsheet"
                  options={{
                    presentation: 'formSheet',
                    animation: 'slide_from_bottom',
                  }}
                />
              </Stack>
            </WidgetProvider>
          </AchievementProvider>
        </TrackerProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
