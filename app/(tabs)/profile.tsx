
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
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useTracker } from '@/contexts/TrackerContext';
import { router } from 'expo-router';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { importIslamicLectures, importQuranRecitations, importAllVideos } from '@/utils/importYouTubeVideos';

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

  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      loadWeeklyStats();
    }
  }, [user]);

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

  const handleImportLectures = async () => {
    Alert.alert(
      'Import Islamic Lectures',
      'This will fetch the first 100 Islamic lecture videos from YouTube and import them into the database. This may take a few minutes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importIslamicLectures();
              if (result.success) {
                Alert.alert('Success', result.message);
              } else {
                Alert.alert('Error', result.error || 'Failed to import lectures');
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
      'This will fetch the first 100 Quran recitation videos from YouTube and import them into the database. This may take a few minutes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importQuranRecitations();
              if (result.success) {
                Alert.alert('Success', result.message);
              } else {
                Alert.alert('Error', result.error || 'Failed to import recitations');
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
      'This will fetch and import both Islamic lectures and Quran recitations from YouTube (200 videos total). This may take several minutes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import All',
          onPress: async () => {
            setImporting(true);
            try {
              const results = await importAllVideos();
              const lecturesMsg = results.lectures.success 
                ? `Lectures: ${results.lectures.imported} imported` 
                : `Lectures: ${results.lectures.error}`;
              const recitationsMsg = results.recitations.success 
                ? `Recitations: ${results.recitations.imported} imported` 
                : `Recitations: ${results.recitations.error}`;
              
              Alert.alert('Import Complete', `${lecturesMsg}\n${recitationsMsg}`);
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
          Alert.alert(
            'Success',
            'Account created! Please check your email to verify your account before signing in.',
            [{ text: 'OK', onPress: () => {
              setIsSignUp(false);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}]
          );
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
        } else {
          Alert.alert('Success', 'Signed in successfully!');
          setEmail('');
          setPassword('');
        }
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
      } else {
        Alert.alert('Success', 'Signed in with Google successfully!');
      }
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

  if (!isConfigured) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleHeaderTap}>
            <Text style={styles.headerTitle}>Profile</Text>
          </TouchableOpacity>
          <View style={styles.backButton} />
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleHeaderTap}>
            <Text style={styles.headerTitle}>Profile</Text>
          </TouchableOpacity>
          <View style={styles.backButton} />
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleHeaderTap}>
            <Text style={styles.headerTitle}>Profile</Text>
          </TouchableOpacity>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
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

              <Text style={styles.adminDescription}>
                Import YouTube videos into the database. This will replace all existing videos.
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
                <Text style={styles.adminButtonText}>Import Islamic Lectures</Text>
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
                <Text style={styles.adminButtonText}>Import Quran Recitations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminButtonPrimary, importing && styles.adminButtonDisabled]}
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
                    <Text style={styles.adminButtonText}>Import All Videos</Text>
                  </React.Fragment>
                )}
              </TouchableOpacity>

              {importing && (
                <View style={styles.importingIndicator}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.importingText}>Importing videos... This may take a few minutes.</Text>
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
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHeaderTap}>
          <Text style={styles.headerTitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
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
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingBottom: 40,
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
  signOutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    boxShadow: '0px 2px 6px rgba(244, 67, 54, 0.3)',
    elevation: 3,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
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
