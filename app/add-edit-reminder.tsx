import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, useTheme, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Reminder, RepeatType, PriorityLevel } from '@/types/reminder';
import { getReminderById, createReminder, updateReminder } from '@/services/storageService';
import { scheduleNotification } from '@/services/notificationService';
import { AppTheme } from '@/constants/appTheme';

export default function AddEditReminderScreen() {
  const { reminderId } = useLocalSearchParams<{ reminderId?: string }>();
  const router = useRouter();
  const theme = useTheme<AppTheme>();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [repeat, setRepeat] = useState<RepeatType>('none');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reminderId) {
      loadReminder();
    }
  }, [reminderId]);

  const loadReminder = async () => {
    if (!reminderId) return;
    
    try {
      const reminder = await getReminderById(reminderId);
      if (reminder) {
        setTitle(reminder.title);
        setDescription(reminder.description || '');
        const dateTime = new Date(reminder.dateTime);
        setDate(dateTime);
        setTime(dateTime);
        setRepeat(reminder.repeat);
        setPriority(reminder.priority);
      }
    } catch (error) {
      console.error('Error loading reminder:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    setLoading(true);
    try {
      const dateTime = new Date(date);
      dateTime.setHours(time.getHours());
      dateTime.setMinutes(time.getMinutes());

      const reminderData = {
        title: title.trim(),
        description: description.trim(),
        dateTime: dateTime.toISOString(),
        repeat,
        priority,
        isActive: true,
      };

      if (reminderId) {
        await updateReminder(reminderId, reminderData);
      } else {
        const newReminder = await createReminder(reminderData);
        
        // Only schedule notifications in standalone builds
        const isExpoGo = __DEV__ && !process.env.EXPO_PUBLIC_USE_DEV_CLIENT;
        if (!isExpoGo) {
          await scheduleNotification(newReminder);
        }
      }

      router.back();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Titre *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: theme.colors.primary, background: theme.colors.surface } }}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          theme={{ colors: { primary: theme.colors.primary, background: theme.colors.surface } }}
        />

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeButton}>
            <Text variant="labelLarge" style={styles.label}>Date</Text>
            <Button 
              mode="outlined" 
              onPress={() => setShowDatePicker(true)}
              icon="calendar"
            >
              {date.toLocaleDateString('fr-FR')}
            </Button>
          </View>

          <View style={styles.dateTimeButton}>
            <Text variant="labelLarge" style={styles.label}>Heure</Text>
            <Button 
              mode="outlined" 
              onPress={() => setShowTimePicker(true)}
              icon="clock-outline"
            >
              {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Button>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.label}>Répétition</Text>
          <SegmentedButtons
            value={repeat}
            onValueChange={(value) => setRepeat(value as RepeatType)}
            buttons={[
              { value: 'none', label: 'Unique' },
              { value: 'daily', label: 'Quotidienne' },
              { value: 'weekly', label: 'Hebdomadaire' },
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.label}>Priorité</Text>
          <SegmentedButtons
            value={priority}
            onValueChange={(value) => setPriority(value as PriorityLevel)}
            buttons={[
              { 
                value: 'low', 
                label: 'Faible',
                style: priority === 'low' ? { backgroundColor: theme.custom.priorityLow } : undefined
              },
              { 
                value: 'medium', 
                label: 'Moyenne',
                style: priority === 'medium' ? { backgroundColor: theme.custom.priorityMedium } : undefined
              },
              { 
                value: 'high', 
                label: 'Élevée',
                style: priority === 'high' ? { backgroundColor: theme.custom.priorityHigh } : undefined
              },
            ]}
          />
        </View>

        <View style={styles.actions}>
          <Button 
            mode="outlined" 
            onPress={() => router.back()}
            style={styles.button}
          >
            Annuler
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Enregistrer
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateTimeButton: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});