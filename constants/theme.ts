import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0052FF',
    background: '#F6F8FA',
    surface: '#FFFFFF',
    text: '#000000',
    placeholder: '#A9A9A9',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF3B30',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  roundness: 12,
};
