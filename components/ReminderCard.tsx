import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Switch, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Reminder } from '@/types/reminder';

interface ReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

const ReminderCard = ({ reminder, onPress, onToggle, onDelete }: ReminderCardProps) => {
  const { title, dateTime, isActive } = reminder;

  // Get the time from the dateTime string
  const time = new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="bell" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Switch
        value={isActive}
        onValueChange={onToggle}
        color={theme.colors.primary}
      />
      <IconButton
        icon="delete"
        size={24}
        onPress={onDelete}
        iconColor={theme.colors.notification}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    elevation: 2,
  },
  iconContainer: {
    marginRight: theme.spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  time: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
});

export default ReminderCard;
