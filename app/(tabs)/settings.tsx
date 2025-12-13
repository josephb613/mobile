import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { List, Appbar, Divider, useTheme, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Paramètres" />
      </Appbar.Header>

      <ScrollView>
        <List.Section>
          <List.Subheader>Application</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
          <Divider />
          <List.Item
            title="Notifications"
            description="Gérer les permissions de notification"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>À propos</List.Subheader>
          <List.Item
            title="Application de rappels"
            description="Une application simple pour gérer vos rappels avec alarmes"
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
        </List.Section>

        <View style={styles.footer}>
          <MaterialCommunityIcons 
            name="alarm-check" 
            size={48} 
            color={theme.colors.primary} 
          />
          <Text variant="bodySmall" style={styles.footerText}>
            Alarme App v1.0.0
          </Text>
          <Text variant="bodySmall" style={[styles.footerText, { opacity: 0.6 }]}>
            Développé avec React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
    marginTop: 24,
  },
  footerText: {
    marginTop: 8,
    textAlign: 'center',
  },
});