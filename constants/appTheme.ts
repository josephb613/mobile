import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    primaryContainer: '#BB86FC',
    secondary: '#03DAC6',
    secondaryContainer: '#03DAC6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#F44336',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#FFFFFF',
  },
  custom: {
    priorityHigh: '#EF5350',
    priorityMedium: '#FF9800',
    priorityLow: '#42A5F5',
    success: '#4CAF50',
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    primaryContainer: '#3700B3',
    secondary: '#03DAC6',
    secondaryContainer: '#03DAC6',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#CF6679',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000',
  },
  custom: {
    priorityHigh: '#EF5350',
    priorityMedium: '#FF9800',
    priorityLow: '#42A5F5',
    success: '#4CAF50',
  }
};

export type AppTheme = typeof lightTheme;