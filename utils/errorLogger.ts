
// Global error logging for runtime errors
import { Platform } from "react-native";

// Simple debouncing to prevent duplicate errors
const recentErrors: { [key: string]: boolean } = {};
const clearErrorAfterDelay = (errorKey: string) => {
  setTimeout(() => delete recentErrors[errorKey], 100);
};

// Function to send errors to parent window (React frontend)
const sendErrorToParent = (level: string, message: string, data: any) => {
  const errorKey = `${level}:${message}:${JSON.stringify(data)}`;

  if (recentErrors[errorKey]) {
    return;
  }

  recentErrors[errorKey] = true;
  clearErrorAfterDelay(errorKey);

  try {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'EXPO_ERROR',
        level: level,
        message: message,
        data: data,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        source: 'expo-template'
      }, '*');
    }
  } catch (error) {
    console.error('Failed to send error to parent:', error);
  }
};

export const setupErrorLogging = () => {
  // Capture unhandled errors in web environment
  if (typeof window !== 'undefined') {
    window.onerror = (message, source, lineno, colno, error) => {
      const sourceFile = source ? source.split('/').pop() : 'unknown';
      const errorData = {
        message: message,
        source: `${sourceFile}:${lineno}:${colno}`,
        line: lineno,
        column: colno,
        error: error?.stack || error,
        timestamp: new Date().toISOString()
      };

      console.error('Runtime Error:', errorData);
      sendErrorToParent('error', 'JavaScript Runtime Error', errorData);
      return false;
    };

    if (Platform.OS === 'web') {
      window.addEventListener('unhandledrejection', (event) => {
        const errorData = {
          reason: event.reason,
          timestamp: new Date().toISOString()
        };

        console.error('Unhandled Promise Rejection:', errorData);
        sendErrorToParent('error', 'Unhandled Promise Rejection', errorData);
      });
    }
  }
};
