import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ReminderCard from '@/components/ReminderCard';
import HomeScreenHeader from '@/components/HomeScreenHeader';
import WaterTracker from '@/components/WaterTracker';
import { Reminder } from '@/types/reminder';
import { getAllReminders, deleteReminder, toggleReminderActive, updateReminder } from '@/services/storageService';
import { scheduleNotification, cancelNotification } from '@/services/notificationService';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadReminders = async () => {
    try {
      const data = await getAllReminders();
      setReminders(data);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  const handleToggle = async (reminder: Reminder) => {
    try {
      await toggleReminderActive(reminder.id);
      
      // Only schedule notifications in standalone builds
      const isExpoGo = __DEV__ && !process.env.EXPO_PUBLIC_USE_DEV_CLIENT;
      if (!isExpoGo) {
        if (!reminder.isActive) {
          // Schedule notification when activating
          const notificationId = await scheduleNotification(reminder);
          await updateReminder(reminder.id, { notificationId });
        } else {
          // Cancel notification when deactivating
          if (reminder.notificationId) {
            await cancelNotification(reminder.notificationId);
          }
        }
      }
      
      await loadReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReminder(id);
      await loadReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    router.push({
      pathname: '/add-edit-reminder',
      params: { reminderId: reminder.id }
    });
  };

  const handleAdd = () => {
    router.push('/add-edit-reminder');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HomeScreenHeader />
      <WaterTracker />

      {reminders.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={64}
            color={theme.colors.placeholder}
          />
          <Text variant="titleMedium" style={styles.emptyTitle}>
            Aucun rappel
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Créez votre premier rappel
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.yourAlarmsTitle}>Vos Alarmes</Text>
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReminderCard
                reminder={item}
                onPress={() => handleEdit(item)}
                onToggle={() => handleToggle(item)}
                onDelete={() => handleDelete(item.id)}
              />
            )}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAdd}
        color={theme.colors.onPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 8,
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  yourAlarmsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
});