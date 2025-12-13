import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Switch, IconButton, useTheme } from 'react-native-paper';
import { Reminder } from '@/types/reminder';
import { formatReminderDate, getRepeatLabel, getPriorityLabel } from '@/utils/dateUtils';
import { AppTheme } from '@/constants/appTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export default function ReminderCard({ reminder, onPress, onToggle, onDelete }: ReminderCardProps) {
  const theme = useTheme<AppTheme>();
  
  const getPriorityColor = () => {
    switch (reminder.priority) {
      case 'high':
        return theme.custom.priorityHigh;
      case 'medium':
        return theme.custom.priorityMedium;
      case 'low':
        return theme.custom.priorityLow;
      default:
        return theme.colors.primary;
    }
  };
  
  return (
    <Card 
      style={[styles.card, { borderLeftColor: getPriorityColor(), borderLeftWidth: 4 }]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons 
              name="bell-outline" 
              size={24} 
              color={reminder.isActive ? getPriorityColor() : theme.colors.outline}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text 
                variant="titleMedium" 
                style={[styles.title, !reminder.isActive && styles.inactiveText]}
              >
                {reminder.title}
              </Text>
              {reminder.description && (
                <Text 
                  variant="bodySmall" 
                  style={[styles.description, !reminder.isActive && styles.inactiveText]}
                  numberOfLines={2}
                >
                  {reminder.description}
                </Text>
              )}
            </View>
          </View>
          <Switch 
            value={reminder.isActive} 
            onValueChange={onToggle}
            color={getPriorityColor()}
          />
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={styles.detailText}>
              {formatReminderDate(new Date(reminder.dateTime))}
            </Text>
          </View>
          
          {reminder.repeat !== 'none' && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="repeat" size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.detailText}>
                {getRepeatLabel(reminder.repeat)}
              </Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="flag-outline" size={16} color={getPriorityColor()} />
            <Text variant="bodySmall" style={[styles.detailText, { color: getPriorityColor() }]}>
              {getPriorityLabel(reminder.priority)}
            </Text>
          </View>
        </View>
      </Card.Content>
      
      <Card.Actions>
        <IconButton
          icon="delete-outline"
          size={20}
          onPress={onDelete}
          iconColor={theme.colors.error}
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    marginTop: 4,
    opacity: 0.7,
  },
  inactiveText: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    opacity: 0.8,
  },
});