
import { StyleSheet } from 'react-native';

export const colors = {
  // Primary Islamic Green Theme
  primary: '#1B5E20',
  primaryLight: '#4CAF50',
  primaryDark: '#0D3D13',
  
  // Secondary Gold/Amber
  secondary: '#FFA000',
  secondaryLight: '#FFC107',
  secondaryDark: '#FF6F00',
  
  // Neutral Colors
  background: '#FFFFFF',
  backgroundDark: '#121212',
  surface: '#F5F5F5',
  surfaceDark: '#1E1E1E',
  
  // Text Colors
  text: '#212121',
  textDark: '#FFFFFF',
  textSecondary: '#757575',
  textSecondaryDark: '#B0B0B0',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Prayer Time Colors
  fajr: '#5C6BC0',
  dhuhr: '#FFA726',
  asr: '#FFB74D',
  maghrib: '#EF5350',
  isha: '#7E57C2',
  
  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  cardDark: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
