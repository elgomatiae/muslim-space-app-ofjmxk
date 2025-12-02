
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './AuthContext';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  permissionStatus: Notifications.PermissionStatus | null;
  requestPermissions: () => Promise<boolean>;
  schedulePrayerNotification: (prayerName: string, time: Date) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  expoPushToken: null,
  notification: null,
  permissionStatus: null,
  requestPermissions: async () => false,
  schedulePrayerNotification: async () => {},
  cancelAllNotifications: async () => {},
});

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { user } = useAuth();
  const hasRequestedPermission = useRef(false);

  useEffect(() => {
    // Check if we're on a physical device
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return;
    }

    // Initialize notifications
    initializeNotifications();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const initializeNotifications = async () => {
    try {
      // Check current permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('Current notification permission status:', existingStatus);
      setPermissionStatus(existingStatus);

      // If permission hasn't been determined yet and we haven't requested it in this session
      if (existingStatus === 'undetermined' && !hasRequestedPermission.current) {
        console.log('Requesting notification permissions for the first time...');
        hasRequestedPermission.current = true;
        await requestPermissions();
      } else if (existingStatus === 'granted') {
        // If permission was already granted, set up push notifications
        console.log('Notification permissions already granted, setting up push notifications...');
        await registerForPushNotificationsAsync();
      } else {
        console.log('Notification permissions status:', existingStatus);
      }
    } catch (error) {
      console.log('Error initializing notifications:', error);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      console.log('Requesting notification permissions...');
      
      let finalStatus: Notifications.PermissionStatus;

      if (Platform.OS === 'android') {
        // For Android, we need to create a channel first (required for Android 13+)
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        // Request permission
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      } else {
        // For iOS - request with all options
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
        finalStatus = status;
      }

      console.log('Permission request result:', finalStatus);
      setPermissionStatus(finalStatus);

      // If permission granted, register for push notifications
      if (finalStatus === 'granted') {
        await registerForPushNotificationsAsync();
        return true;
      } else {
        console.log('Notification permissions not granted');
        return false;
      }
    } catch (error) {
      console.log('Error requesting permissions:', error);
      return false;
    }
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      // Configure notification channels for Android
      if (Platform.OS === 'android') {
        // Create channels for different notification types
        await Notifications.setNotificationChannelAsync('prayers', {
          name: 'Prayer Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('dhikr', {
          name: 'Dhikr Reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('quran', {
          name: 'Quran Reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
        });
      }

      // Get the Expo push token (optional - only if you want to send push notifications from a server)
      // Note: This requires an Expo project ID
      // Uncomment the following if you want to use Expo push notifications:
      /*
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-expo-project-id', // Replace with your actual Expo project ID
        });
        
        const token = tokenData.data;
        console.log('Expo push token:', token);
        setExpoPushToken(token);

        // Save the token to the database if user is logged in
        if (isSupabaseConfigured() && supabase && user) {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              push_token: token,
              push_notifications_enabled: true,
            }, {
              onConflict: 'user_id',
            });

          if (error) {
            console.log('Error saving push token:', error);
          } else {
            console.log('Push token saved successfully');
          }
        }
      } catch (tokenError) {
        console.log('Error getting Expo push token:', tokenError);
      }
      */

      console.log('Push notifications registered successfully');
    } catch (error) {
      console.log('Error registering for push notifications:', error);
    }
  };

  const schedulePrayerNotification = async (prayerName: string, time: Date) => {
    try {
      // Check if notifications are enabled
      if (permissionStatus !== 'granted') {
        console.log('Notifications not enabled');
        return;
      }

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for ${prayerName} Prayer 🕌`,
          body: `It's time to pray ${prayerName}. May Allah accept your prayers.`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { prayerName, type: 'prayer' },
        },
        trigger: {
          date: time,
          channelId: Platform.OS === 'android' ? 'prayers' : undefined,
        },
      });

      console.log(`Scheduled notification for ${prayerName} at ${time}`);
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.log('Error cancelling notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        permissionStatus,
        requestPermissions,
        schedulePrayerNotification,
        cancelAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
