import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';

import { initDatabase } from '@/services/storageService';
import { theme } from '@/constants/theme';
import { requestPermissions, setupNotificationHandler } from '@/services/notificationService';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    // Initialize database and notifications
    const init = async () => {
      try {
        await initDatabase();
        
        // Only setup notifications in standalone builds, not in Expo Go
        const isExpoGo = __DEV__ && !process.env.EXPO_PUBLIC_USE_DEV_CLIENT;
        if (!isExpoGo) {
          await requestPermissions();
          setupNotificationHandler();
        } else {
          console.log('Running in Expo Go - notifications disabled. Build standalone app for full functionality.');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    
    init();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="add-edit-reminder" 
          options={{ 
            presentation: 'modal', 
            title: 'Rappel',
            headerShown: true 
          }} 
        />
        <Stack.Screen
          name="alarm"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </PaperProvider>
  );
}
