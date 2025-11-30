
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileButton() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <TouchableOpacity
      style={[styles.button, user && styles.buttonActive]}
      onPress={() => router.push('/(tabs)/profile')}
      activeOpacity={0.7}
    >
      <IconSymbol
        ios_icon_name="person.circle.fill"
        android_material_icon_name="account-circle"
        size={32}
        color={user ? colors.primary : colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  buttonActive: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
