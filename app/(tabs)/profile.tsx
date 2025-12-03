
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useTracker } from '@/contexts/TrackerContext';
import { router } from 'expo-router';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { importIslamicLectures, importQuranRecitations, importAllVideos, cleanupBrokenVideos } from '@/utils/importYouTubeVideos';
import { importIslamNetLectures, getLecturesCount, getRecitationsCount } from '@/utils/populateIslamNetLectures';
import { importYouTubePlaylist, getLecturesByCategory } from '@/utils/importYouTubePlaylist';

interface NotificationSettings {
  prayer_reminders: boolean;
  dhikr_reminders: boolean;
  quran_reminders: boolean;
  weekly_challenge_reminders: boolean;
  achievement_notifications: boolean;
}

export default function ProfileScreen() {
  const { user, signIn, signUp, signInWithGoogle, signOut, loading, isConfigured } = useAuth();
  const { trackerData } = useTracker();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [importing, setImporting] = useState(false);
  const [lecturesCount, setLecturesCount] = useState(0);
  const [recitationsCount, setRecitationsCount] = useState(0);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    prayer_reminders: true,
    dhikr_reminders: true,
    quran_reminders: true,
    weekly_challenge_reminders: true,
    achievement_notifications: true,
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      loadWeeklyStats();
      loadNotificationSettings();
    }
  }, [user]);

  useEffect(() => {
    if (showAdminPanel) {
      loadCounts();
    }
  }, [showAdminPanel]);

  const loadCounts = async () => {
    const lectures = await getLecturesCount();
    const recitations = await getRecitationsCount();
    setLecturesCount(lectures);
    setRecitationsCount(recitations);
  };

  const loadNotificationSettings = async () => {
    if (!user || !isSupabaseConfigured()) return;

    setLoadingSettings(true);
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no settings exist, create default ones
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              prayer_reminders: true,
              dhikr_reminders: true,
              quran_reminders: true,
              weekly_challenge_reminders: true,
              achievement_notifications: true,
            });

          if (insertError) {
            console.error('Error creating settings:', insertError);
          }
        } else {
          console.error('Error loading settings:', error);
        }
        return;
      }

      if (data) {
        setNotificationSettings({
          prayer_reminders: data.prayer_reminders ?? true,
          dhikr_reminders: data.dhikr_reminders ?? true,
          quran_reminders: data.quran_reminders ?? true,
          weekly_challenge_reminders: data.weekly_challenge_reminders ?? true,
          achievement_notifications: data.achievement_notifications ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const updateNotificationSetting = async (key: keyof NotificationSettings, value: boolean) => {
    if (!user || !isSupabaseConfigured()) return;

    // Update local state immediately for better UX
    setNotificationSettings(prev => ({ ...prev, [key]: value }));

    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating setting:', error);
        // Revert on error
        setNotificationSettings(prev => ({ ...prev, [key]: !value }));
        Alert.alert('Error', 'Failed to update notification setting');
      }
    } catch (error) {
      console.error('Error updating notification setting:', error);
      // Revert on error
      setNotificationSettings(prev => ({ ...prev, [key]: !value }));
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSavingSettings(false);
    }
  };

  const loadWeeklyStats = async () => {
    if (!user || !isSupabaseConfigured()) return;

    setLoadingStats(true);
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const { data, error } = await supabase
        .from('iman_tracker')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0]);

      if (error) {
        console.error('Error loading weekly stats:', error);
        return;
      }

      if (data && data.length > 0) {
        const totalPrayers = data.reduce((sum, day) => sum + (day.prayers_completed || 0), 0);
        const totalDhikr = data.reduce((sum, day) => sum + (day.dhikr_count || 0), 0);
        const totalQuranPages = data.reduce((sum, day) => sum + (day.quran_pages || 0), 0);
        const totalQuranVerses = data.reduce((sum, day) => sum + (day.quran_verses_memorized || 0), 0);
        const maxPrayerStreak = Math.max(...data.map(day => day.prayers_streak || 0));
        const maxDhikrStreak = Math.max(...data.map(day => day.dhikr_streak || 0));
        const maxQuranStreak = Math.max(...data.map(day => day.quran_streak || 0));

        setWeeklyStats({
          totalPrayers,
          totalDhikr,
          totalQuranPages,
          totalQuranVerses,
          maxPrayerStreak,
          maxDhikrStreak,
          maxQuranStreak,
          daysTracked: data.length,
        });
      }
    } catch (error) {
      console.error('Error loading weekly stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleHeaderTap = () => {
    const newCount = adminTapCount + 1;
    setAdminTapCount(newCount);
    
    if (newCount >= 7) {
      setShowAdminPanel(true);
      setAdminTapCount(0);
      Alert.alert('Admin Panel', 'Admin panel unlocked!');
    }
  };

  const handleImport50Lectures = async () => {
    Alert.alert(
      'Import 50 More Lectures',
      `This will import 50 additional Islamic lectures using the YouTube Data API.\n\nCurrent lectures: ${lecturesCount}\n\nNote: You need a valid YouTube API key configured in Supabase Edge Function secrets (YOUTUBE_API_KEY).\n\nThis may take several minutes. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importIslamNetLectures('lectures', 50);
              if (result.success) {
                await loadCounts();
                Alert.alert(
                  'Success', 
                  `${result.message}\n\nImported: ${result.lecturesImported}\nFailed: ${result.lecturesFailed || 0}`
                );
              } else {
                Alert.alert(
                  'Error', 
                  result.error || 'Failed to import lectures.\n\nMake sure YOUTUBE_API_KEY is set in Supabase Edge Function secrets.'
                );
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error('Import error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleImport50Recitations = async () => {
    Alert.alert(
      'Import 50 Recitations',
      `This will import 50 Quran recitations using the YouTube Data API.\n\nCurrent recitations: ${recitationsCount}\n\nNote: You need a valid YouTube API key configured in Supabase Edge Function secrets (YOUTUBE_API_KEY).\n\nThis may take several minutes. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importIslamNetLectures('recitations', 50);
              if (result.success) {
                await loadCounts();
                Alert.alert(
                  'Success', 
                  `${result.message}\n\nImported: ${result.recitationsImported}\nFailed: ${result.recitationsFailed || 0}`
                );
              } else {
                Alert.alert(
                  'Error', 
                  result.error || 'Failed to import recitations.\n\nMake sure YOUTUBE_API_KEY is set in Supabase Edge Function secrets.'
                );
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error('Import error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleImportBoth = async () => {
    Alert.alert(
      'Import 50 Lectures + 50 Recitations',
      `This will import 50 lectures and 50 recitations (100 videos total) using the YouTube Data API.\n\nCurrent: ${lecturesCount} lectures, ${recitationsCount} recitations\n\nNote: You need a valid YouTube API key configured in Supabase Edge Function secrets (YOUTUBE_API_KEY).\n\nThis may take 10-15 minutes. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import Both',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importIslamNetLectures('both', 50);
              if (result.success) {
                await loadCounts();
                Alert.alert(
                  'Success', 
                  `${result.message}\n\nLectures: ${result.lecturesImported} imported, ${result.lecturesFailed || 0} failed\nRecitations: ${result.recitationsImported} imported, ${result.recitationsFailed || 0} failed`
                );
              } else {
                Alert.alert(
                  'Error', 
                  result.error || 'Failed to import videos.\n\nMake sure YOUTUBE_API_KEY is set in Supabase Edge Function secrets.'
                );
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error('Import error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleImportOriginal43 = async () => {
    Alert.alert(
      'Import Original 43 Lectures',
      `This will import the original 43 specific Islamic lectures from Islam Net using the YouTube Data API.\n\nCurrent lectures: ${lecturesCount}\n\nNote: You need a valid YouTube API key configured in Supabase Edge Function secrets (YOUTUBE_API_KEY).\n\nThis may take a few minutes. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importIslamNetLectures('lectures', 43);
              if (result.success) {
                await loadCounts();
                Alert.alert(
                  'Success', 
                  `${result.message}\n\nImported: ${result.lecturesImported}\nFailed: ${result.lecturesFailed || 0}`
                );
              } else {
                Alert.alert(
                  'Error', 
                  result.error || 'Failed to import lectures.\n\nMake sure YOUTUBE_API_KEY is set in Supabase Edge Function secrets.'
                );
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error('Import error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleImportLectures = async () => {
    Alert.alert(
      'Import Islamic Lectures',
      'This will fetch the first 100 Islamic lecture videos from YouTube and import them into the database.\n\nNote: You need a valid YouTube API key configured in Supabase Edge Function secrets.\n\nThis may take a few minutes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importIslamicLectures();
              if (result.success) {
                await loadCounts();
                Alert.alert('Success', `${result.message}\n\nImported ${result.imported} videos.`);
              } else {
                Alert.alert(
                  'Error', 
                  result.error || 'Failed to import lectures.\n\nMake sure YOUTUBE_API_KEY is set in Supabase Edge Function secrets.'
                );
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error('Import error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleImportRecitations = async () => {
    Alert.alert(
      'Import Quran Recitations',
      'This will fetch the first 100 Quran recitation videos from YouTube and import them into the database.\n\nNote: You need a valid YouTube API key configured in Supabase Edge Function secrets.\n\nThis may take a few minutes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importQuranRecitations();
              if (result.success) {
                await loadCounts();
                Alert.alert('Success', `${result.message}\n\nImported ${result.imported} videos.`);
              } else {
                Alert.alert(
                  'Error', 
                  result.error || 'Failed to import recitations.\n\nMake sure YOUTUBE_API_KEY is set in Supabase Edge Function secrets.'
                );
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error('Import error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleImportAll = async () => {
    Alert.alert(
      'Import All Videos',
      'This will fetch and import both Islamic lectures and Quran recitations from YouTube (up to 200 videos total).\n\nNote: You need a valid YouTube API key configured in Supabase Edge Function secrets.\n\nThis may take several minutes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import All',
          onPress: async () => {
            setImporting(true);
            try {
              const results = await importAllVideos();
              
              const lecturesMsg = results.lectures.success 
                ? `✓ Lectures: ${results.lectures.imported} imported` 
                : `✗ Lectures: ${results.lectures.error}`;
              
              const recitationsMsg = results.recitations.success 
                ? `✓ Recitations: ${results.recitations.imported} imported` 
                : `✗ Recitations: ${results.recitations.error}`;
              
              const overallSuccess = results.lectures.success || results.recitations.success;
              
              await loadCounts();
              
              Alert.alert(
                overallSuccess ? 'Import Complete' : 'Import Failed', 
                `${lecturesMsg}\n\n${recitationsMsg}`
              );
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error('Import error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleCleanupBrokenVideos = async () => {
    Alert.alert(
      'Clean Up Broken Videos',
      'This will scan all videos in the database and remove any with broken or invalid YouTube URLs.\n\nThis process may take several minutes depending on the number of videos.\n\nContinue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clean Up',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await cleanupBrokenVideos();
              await loadCounts();
              Alert.alert(
                'Cleanup Complete',
                `Removed ${result.lecturesRemoved} broken lecture(s) and ${result.recitationsRemoved} broken recitation(s).`
              );
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred during cleanup');
              console.error('Cleanup error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleImportPlaylist = async () => {
    if (!playlistUrl.trim()) {
      Alert.alert('Error', 'Please enter a YouTube playlist URL');
      return;
    }

    Alert.alert(
      'Import YouTube Playlist',
      `This will import all videos from the playlist and automatically categorize them.\n\nPlaylist URL: ${playlistUrl}\n\nCurrent lectures: ${lecturesCount}\n\nNote: You need a valid YouTube API key configured in Supabase Edge Function secrets (YOUTUBE_API_KEY).\n\nThis may take several minutes depending on the playlist size. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importYouTubePlaylist(playlistUrl);
              if (result.success) {
                await loadCounts();
                const categoryCounts = await getLecturesByCategory();
                const categoryBreakdown = Object.entries(categoryCounts)
                  .map(([cat, count]) => `${cat}: ${count}`)
                  .join('\n');
                
                Alert.alert(
                  'Success', 
                  `${result.message}\n\nImported: ${result.imported}\nFailed: ${result.failed}\nTotal: ${result.total}\n\nCategory Breakdown:\n${categoryBreakdown}`
                );
                setPlaylistUrl(''); // Clear the input
              } else {
                Alert.alert(
                  'Error', 
                  result.error || 'Failed to import playlist.\n\nMake sure YOUTUBE_API_KEY is set in Supabase Edge Function secrets.'
                );
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error('Import error:', error);
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        const { error, data } = await signUp(email, password);
        if (error) {
          Alert.alert('Sign Up Error', error.message || 'Failed to create account');
        } else {
          // Navigate to email verification screen
          router.push('/email-verification');
        }
      } else {
        const { error, data } = await signIn(email, password);
        if (error) {
          if (error.message?.includes('Email not confirmed')) {
            Alert.alert(
              'Email Not Verified',
              'Please verify your email address before signing in. Check your inbox for the verification link.',
              [{ text: 'OK' }]
            );
          } else if (error.message?.includes('Invalid login credentials')) {
            Alert.alert('Sign In Error', 'Invalid email or password. Please try again.');
          } else {
            Alert.alert('Sign In Error', error.message || 'Failed to sign in');
          }
        }
        // Navigation to profile happens automatically when user state changes
      }
    } catch (error) {
      console.log('Auth error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        Alert.alert('Google Sign In Error', error.message || 'Failed to sign in with Google');
      }
      // Navigation to profile happens automatically when user state changes
    } catch (error) {
      console.log('Google sign in error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            Alert.alert('Success', 'Signed out successfully');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Second confirmation
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete your account and all associated data. Are you absolutely sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // Note: Account deletion should be handled by a Supabase Edge Function
                      // for security reasons. For now, we'll just sign out.
                      Alert.alert(
                        'Account Deletion',
                        'Please contact support to delete your account. For now, you will be signed out.'
                      );
                      await signOut();
                    } catch (error) {
                      console.error('Error deleting account:', error);
                      Alert.alert('Error', 'Failed to delete account');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (!isConfigured) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleHeaderTap}>
            <Text style={styles.headerTitle}>Profile</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.notConfiguredCard}>
            <IconSymbol
              ios_icon_name="exclamationmark.triangle.fill"
              android_material_icon_name="warning"
              size={64}
              color={colors.warning}
            />
            <Text style={styles.notConfiguredTitle}>Supabase Not Configured</Text>
            <Text style={styles.notConfiguredText}>
              To enable user authentication and cloud sync, please enable Supabase by pressing the
              Supabase button and connecting to a project.
            </Text>
            <Text style={styles.notConfiguredSubtext}>
              You&apos;ll need to create a Supabase project first if you don&apos;t have one.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleHeaderTap}>
            <Text style={styles.headerTitle}>Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleHeaderTap}>
            <Text style={styles.headerTitle}>Profile</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {showAdminPanel && (
            <View style={styles.adminPanel}>
              <View style={styles.adminHeader}>
                <IconSymbol
                  ios_icon_name="wrench.and.screwdriver.fill"
                  android_material_icon_name="build"
                  size={24}
                  color={colors.warning}
                />
                <Text style={styles.adminTitle}>Admin Panel</Text>
                <TouchableOpacity onPress={() => setShowAdminPanel(false)}>
                  <IconSymbol
                    ios_icon_name="xmark.circle.fill"
                    android_material_icon_name="cancel"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.adminWarning}>
                <IconSymbol
                  ios_icon_name="info.circle.fill"
                  android_material_icon_name="info"
                  size={20}
                  color={colors.accent}
                />
                <Text style={styles.adminWarningText}>
                  These tools require a YouTube API key to be configured in Supabase Edge Function secrets (YOUTUBE_API_KEY).
                </Text>
              </View>

              <View style={styles.statsRow}>
                <IconSymbol
                  ios_icon_name="video.fill"
                  android_material_icon_name="video-library"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.statsText}>
                  Lectures: <Text style={styles.statsValue}>{lecturesCount}</Text> | Recitations: <Text style={styles.statsValue}>{recitationsCount}</Text>
                </Text>
              </View>

              <Text style={styles.adminSectionTitle}>Import 50 More Videos (Recommended)</Text>
              <Text style={styles.adminDescription}>
                Import 50 additional lectures and/or recitations with correct video URLs and thumbnails.
              </Text>

              <TouchableOpacity
                style={[styles.adminButtonPrimary, importing && styles.adminButtonDisabled]}
                onPress={handleImport50Lectures}
                disabled={importing}
              >
                <IconSymbol
                  ios_icon_name="video.fill"
                  android_material_icon_name="video-library"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.adminButtonText}>Import 50 More Lectures</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminButtonPrimary, importing && styles.adminButtonDisabled]}
                onPress={handleImport50Recitations}
                disabled={importing}
              >
                <IconSymbol
                  ios_icon_name="book.fill"
                  android_material_icon_name="menu-book"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.adminButtonText}>Import 50 Recitations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminButtonPrimary, importing && styles.adminButtonDisabled]}
                onPress={handleImportBoth}
                disabled={importing}
              >
                <IconSymbol
                  ios_icon_name="star.fill"
                  android_material_icon_name="star"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.adminButtonText}>Import 50 Lectures + 50 Recitations</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.adminSectionTitle}>Import from YouTube Playlist</Text>
              <Text style={styles.adminDescription}>
                Import all videos from any YouTube playlist. Videos will be automatically categorized based on their titles.
              </Text>

              <View style={styles.playlistInputContainer}>
                <IconSymbol
                  ios_icon_name="link"
                  android_material_icon_name="link"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={styles.playlistInput}
                  placeholder="Paste YouTube playlist URL here"
                  placeholderTextColor={colors.textSecondary}
                  value={playlistUrl}
                  onChangeText={setPlaylistUrl}
                  autoCapitalize="none"
                  editable={!importing}
                />
              </View>

              <TouchableOpacity
                style={[styles.adminButtonPrimary, importing && styles.adminButtonDisabled]}
                onPress={handleImportPlaylist}
                disabled={importing}
              >
                <IconSymbol
                  ios_icon_name="arrow.down.circle.fill"
                  android_material_icon_name="download"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.adminButtonText}>Import Playlist</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.adminSectionTitle}>Original Islam Net Lectures</Text>
              <Text style={styles.adminDescription}>
                Import the original 43 specific Islamic lectures from Islam Net.
              </Text>

              <TouchableOpacity
                style={[styles.adminButton, importing && styles.adminButtonDisabled]}
                onPress={handleImportOriginal43}
                disabled={importing}
              >
                <IconSymbol
                  ios_icon_name="star.fill"
                  android_material_icon_name="star"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.adminButtonText}>Import Original 43 Lectures</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.adminSectionTitle}>General Import</Text>
              <Text style={styles.adminDescription}>
                Import YouTube videos into the database. This will replace all existing videos with fresh, validated content from YouTube.
              </Text>

              <TouchableOpacity
                style={[styles.adminButton, importing && styles.adminButtonDisabled]}
                onPress={handleImportLectures}
                disabled={importing}
              >
                <IconSymbol
                  ios_icon_name="video.fill"
                  android_material_icon_name="video-library"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.adminButtonText}>Import Islamic Lectures (100)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminButton, importing && styles.adminButtonDisabled]}
                onPress={handleImportRecitations}
                disabled={importing}
              >
                <IconSymbol
                  ios_icon_name="book.fill"
                  android_material_icon_name="menu-book"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.adminButtonText}>Import Quran Recitations (100)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminButton, importing && styles.adminButtonDisabled]}
                onPress={handleImportAll}
                disabled={importing}
              >
                {importing ? (
                  <ActivityIndicator color={colors.card} />
                ) : (
                  <React.Fragment>
                    <IconSymbol
                      ios_icon_name="arrow.down.circle.fill"
                      android_material_icon_name="download"
                      size={20}
                      color={colors.card}
                    />
                    <Text style={styles.adminButtonText}>Import All Videos (200)</Text>
                  </React.Fragment>
                )}
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.adminSectionTitle}>Maintenance</Text>
              <Text style={styles.adminDescription}>
                Clean up broken or invalid video links from the database.
              </Text>

              <TouchableOpacity
                style={[styles.adminButtonDanger, importing && styles.adminButtonDisabled]}
                onPress={handleCleanupBrokenVideos}
                disabled={importing}
              >
                <IconSymbol
                  ios_icon_name="trash.fill"
                  android_material_icon_name="delete"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.adminButtonText}>Clean Up Broken Videos</Text>
              </TouchableOpacity>

              {importing && (
                <View style={styles.importingIndicator}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.importingText}>Processing... This may take several minutes.</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <IconSymbol
                ios_icon_name="person.fill"
                android_material_icon_name="person"
                size={48}
                color={colors.card}
              />
            </View>
            <Text style={styles.emailText}>{user.email}</Text>
            <Text style={styles.userIdText}>User ID: {user.id.substring(0, 8)}...</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today&apos;s Progress</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <IconSymbol
                  ios_icon_name="hands.sparkles.fill"
                  android_material_icon_name="favorite"
                  size={28}
                  color={colors.primary}
                />
                <Text style={styles.statValue}>{trackerData.prayers.completed}/{trackerData.prayers.total}</Text>
                <Text style={styles.statLabel}>Prayers</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol
                  ios_icon_name="sparkles"
                  android_material_icon_name="auto-awesome"
                  size={28}
                  color={colors.secondary}
                />
                <Text style={styles.statValue}>{trackerData.dhikr.count}</Text>
                <Text style={styles.statLabel}>Dhikr</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol
                  ios_icon_name="book.fill"
                  android_material_icon_name="menu-book"
                  size={28}
                  color={colors.accent}
                />
                <Text style={styles.statValue}>{trackerData.quran.pages}</Text>
                <Text style={styles.statLabel}>Pages</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol
                  ios_icon_name="brain.head.profile"
                  android_material_icon_name="psychology"
                  size={28}
                  color={colors.accent}
                />
                <Text style={styles.statValue}>{trackerData.quran.versesMemorized}</Text>
                <Text style={styles.statLabel}>Verses</Text>
              </View>
            </View>
          </View>

          {weeklyStats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Last 7 Days</Text>
              
              <View style={styles.weeklyCard}>
                <View style={styles.weeklyRow}>
                  <View style={styles.weeklyItem}>
                    <IconSymbol
                      ios_icon_name="hands.sparkles.fill"
                      android_material_icon_name="favorite"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.weeklyValue}>{weeklyStats.totalPrayers}</Text>
                    <Text style={styles.weeklyLabel}>Total Prayers</Text>
                  </View>
                  <View style={styles.weeklyItem}>
                    <IconSymbol
                      ios_icon_name="sparkles"
                      android_material_icon_name="auto-awesome"
                      size={20}
                      color={colors.secondary}
                    />
                    <Text style={styles.weeklyValue}>{weeklyStats.totalDhikr}</Text>
                    <Text style={styles.weeklyLabel}>Total Dhikr</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.weeklyRow}>
                  <View style={styles.weeklyItem}>
                    <IconSymbol
                      ios_icon_name="book.fill"
                      android_material_icon_name="menu-book"
                      size={20}
                      color={colors.accent}
                    />
                    <Text style={styles.weeklyValue}>{weeklyStats.totalQuranPages}</Text>
                    <Text style={styles.weeklyLabel}>Pages Read</Text>
                  </View>
                  <View style={styles.weeklyItem}>
                    <IconSymbol
                      ios_icon_name="brain.head.profile"
                      android_material_icon_name="psychology"
                      size={20}
                      color={colors.accent}
                    />
                    <Text style={styles.weeklyValue}>{weeklyStats.totalQuranVerses}</Text>
                    <Text style={styles.weeklyLabel}>Verses Memorized</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.streaksRow}>
                  <Text style={styles.streaksTitle}>Best Streaks</Text>
                  <View style={styles.streaksList}>
                    <View style={styles.streakItem}>
                      <IconSymbol
                        ios_icon_name="flame.fill"
                        android_material_icon_name="local-fire-department"
                        size={16}
                        color={colors.warning}
                      />
                      <Text style={styles.streakText}>Prayers: {weeklyStats.maxPrayerStreak} days</Text>
                    </View>
                    <View style={styles.streakItem}>
                      <IconSymbol
                        ios_icon_name="flame.fill"
                        android_material_icon_name="local-fire-department"
                        size={16}
                        color={colors.warning}
                      />
                      <Text style={styles.streakText}>Dhikr: {weeklyStats.maxDhikrStreak} days</Text>
                    </View>
                    <View style={styles.streakItem}>
                      <IconSymbol
                        ios_icon_name="flame.fill"
                        android_material_icon_name="local-fire-department"
                        size={16}
                        color={colors.warning}
                      />
                      <Text style={styles.streakText}>Quran: {weeklyStats.maxQuranStreak} days</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Settings</Text>
            
            {loadingSettings ? (
              <View style={styles.loadingSettingsCard}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingSettingsText}>Loading settings...</Text>
              </View>
            ) : (
              <View style={styles.settingsCard}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <IconSymbol
                      ios_icon_name="bell.fill"
                      android_material_icon_name="notifications"
                      size={20}
                      color={colors.primary}
                    />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Prayer Reminders</Text>
                      <Text style={styles.settingDescription}>Get notified before prayer times</Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationSettings.prayer_reminders}
                    onValueChange={(value) => updateNotificationSetting('prayer_reminders', value)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.card}
                    disabled={savingSettings}
                  />
                </View>

                <View style={styles.settingDivider} />

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <IconSymbol
                      ios_icon_name="sparkles"
                      android_material_icon_name="auto-awesome"
                      size={20}
                      color={colors.secondary}
                    />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Dhikr Reminders</Text>
                      <Text style={styles.settingDescription}>Daily dhikr practice reminders</Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationSettings.dhikr_reminders}
                    onValueChange={(value) => updateNotificationSetting('dhikr_reminders', value)}
                    trackColor={{ false: colors.border, true: colors.secondary }}
                    thumbColor={colors.card}
                    disabled={savingSettings}
                  />
                </View>

                <View style={styles.settingDivider} />

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <IconSymbol
                      ios_icon_name="book.fill"
                      android_material_icon_name="menu-book"
                      size={20}
                      color={colors.accent}
                    />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Quran Reminders</Text>
                      <Text style={styles.settingDescription}>Daily Quran reading reminders</Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationSettings.quran_reminders}
                    onValueChange={(value) => updateNotificationSetting('quran_reminders', value)}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor={colors.card}
                    disabled={savingSettings}
                  />
                </View>

                <View style={styles.settingDivider} />

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <IconSymbol
                      ios_icon_name="trophy.fill"
                      android_material_icon_name="emoji-events"
                      size={20}
                      color={colors.warning}
                    />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Weekly Challenges</Text>
                      <Text style={styles.settingDescription}>New challenge notifications</Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationSettings.weekly_challenge_reminders}
                    onValueChange={(value) => updateNotificationSetting('weekly_challenge_reminders', value)}
                    trackColor={{ false: colors.border, true: colors.warning }}
                    thumbColor={colors.card}
                    disabled={savingSettings}
                  />
                </View>

                <View style={styles.settingDivider} />

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <IconSymbol
                      ios_icon_name="star.fill"
                      android_material_icon_name="star"
                      size={20}
                      color={colors.success}
                    />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Achievement Notifications</Text>
                      <Text style={styles.settingDescription}>Get notified when you unlock achievements</Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationSettings.achievement_notifications}
                    onValueChange={(value) => updateNotificationSetting('achievement_notifications', value)}
                    trackColor={{ false: colors.border, true: colors.success }}
                    thumbColor={colors.card}
                    disabled={savingSettings}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            <TouchableOpacity style={styles.settingCard}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name="envelope.fill"
                  android_material_icon_name="email"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.settingText}>Email</Text>
              </View>
              <Text style={styles.settingValue}>{user.email}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingCard}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name="calendar.badge.clock"
                  android_material_icon_name="schedule"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={styles.settingText}>Member Since</Text>
              </View>
              <Text style={styles.settingValue}>
                {new Date(user.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Sync</Text>
            <View style={styles.infoCard}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={32}
                color={colors.success}
              />
              <Text style={styles.infoTitle}>Cloud Sync Enabled</Text>
              <Text style={styles.infoText}>
                Your Iman Tracker stats are automatically saved to your profile and will be
                available when you sign in on any device.
              </Text>
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <IconSymbol
                ios_icon_name="rectangle.portrait.and.arrow.right"
                android_material_icon_name="logout"
                size={20}
                color={colors.card}
              />
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
            >
              <IconSymbol
                ios_icon_name="trash.fill"
                android_material_icon_name="delete-forever"
                size={20}
                color={colors.card}
              />
              <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>

          {/* Extra padding at bottom to prevent tab bar overlap */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleHeaderTap}>
          <Text style={styles.headerTitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.authCard}>
          <View style={styles.authIconCircle}>
            <IconSymbol
              ios_icon_name="person.circle.fill"
              android_material_icon_name="account-circle"
              size={64}
              color={colors.primary}
            />
          </View>
          
          <Text style={styles.authTitle}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.authSubtitle}>
            {isSignUp
              ? 'Sign up to save your Iman Tracker stats to the cloud'
              : 'Sign in to access your saved data'}
          </Text>

          <View style={styles.inputContainer}>
            <IconSymbol
              ios_icon_name="envelope.fill"
              android_material_icon_name="email"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!submitting}
            />
          </View>

          <View style={styles.inputContainer}>
            <IconSymbol
              ios_icon_name="lock.fill"
              android_material_icon_name="lock"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!submitting}
            />
          </View>

          {isSignUp && (
            <View style={styles.inputContainer}>
              <IconSymbol
                ios_icon_name="lock.fill"
                android_material_icon_name="lock"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!submitting}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.authButton, submitting && styles.authButtonDisabled]}
            onPress={handleAuth}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <React.Fragment>
                <IconSymbol
                  ios_icon_name={isSignUp ? 'person.badge.plus' : 'arrow.right.circle.fill'}
                  android_material_icon_name={isSignUp ? 'person-add' : 'login'}
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.authButtonText}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              </React.Fragment>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, submitting && styles.authButtonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <React.Fragment>
                <IconSymbol
                  ios_icon_name="globe"
                  android_material_icon_name="language"
                  size={20}
                  color={colors.text}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </React.Fragment>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            disabled={submitting}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.switchButtonTextBold}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.accent}
          />
          <Text style={styles.infoTitle}>Why Create an Account?</Text>
          <Text style={styles.infoText}>
            • Save your Iman Tracker stats to the cloud{'\n'}
            • Access your data from any device{'\n'}
            • Never lose your progress{'\n'}
            • Track your spiritual journey over time
          </Text>
        </View>

        {/* Extra padding at bottom to prevent tab bar overlap */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminPanel: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.warning,
    boxShadow: '0px 4px 12px rgba(255, 152, 0, 0.2)',
    elevation: 4,
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginLeft: 12,
  },
  adminWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  adminWarningText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  statsText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  statsValue: {
    fontWeight: '700',
    color: colors.primary,
  },
  adminSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 4,
  },
  adminDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  adminButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  adminButtonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(63, 81, 181, 0.3)',
    elevation: 3,
  },
  adminButtonDanger: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(244, 67, 54, 0.3)',
    elevation: 3,
  },
  adminButtonDisabled: {
    opacity: 0.6,
  },
  adminButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
  importingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginTop: 8,
  },
  importingText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 12,
  },
  notConfiguredCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  notConfiguredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  notConfiguredText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  notConfiguredSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emailText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userIdText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  weeklyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  weeklyItem: {
    alignItems: 'center',
    flex: 1,
  },
  weeklyValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  weeklyLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  streaksRow: {
    marginTop: 8,
  },
  streaksTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  streaksList: {
    gap: 8,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakText: {
    fontSize: 14,
    color: colors.text,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  loadingSettingsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  loadingSettingsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  signOutButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
  deleteAccountButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(244, 67, 54, 0.3)',
    elevation: 3,
  },
  deleteAccountButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 120,
  },
  playlistInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  playlistInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 12,
    paddingLeft: 12,
  },
  authCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  authIconCircle: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    paddingLeft: 12,
  },
  authButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0px 2px 6px rgba(63, 81, 181, 0.3)',
    elevation: 3,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 12,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  switchButton: {
    padding: 8,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  switchButtonTextBold: {
    fontWeight: '700',
    color: colors.primary,
  },
});
