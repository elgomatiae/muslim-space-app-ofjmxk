
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileButton() {
  const { user } = useAuth();

  const handlePress = () => {
    console.log('Profile button pressed, navigating to profile...');
    router.navigate('/(tabs)/profile');
  };

  return (
    <TouchableOpacity
      style={[styles.button, user && styles.buttonActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <IconSymbol
        ios_icon_name="person.circle.fill"
        android_material_icon_name="account-circle"
        size={28}
        color={user ? colors.primary : colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.border,
  },
  buttonActive: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    boxShadow: '0px 3px 10px rgba(63, 81, 181, 0.3)',
    elevation: 5,
  },
});
