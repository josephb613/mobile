import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Platform, TouchableOpacity, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { RepeatType, PriorityLevel } from '@/types/reminder';
import { getReminderById, createReminder, updateReminder } from '@/services/storageService';
import { scheduleNotification } from '@/services/notificationService';
import { theme } from '@/constants/theme';

export default function AddEditReminderScreen() {
  const { reminderId } = useLocalSearchParams<{ reminderId?: string }>();
  const router = useRouter();

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
  }, [reminderId, loadReminder]);

  const loadReminder = useCallback(async () => {
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
  }, [reminderId]);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>{reminderId ? 'Modifier le Rappel' : 'Ajouter un Rappel'}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Titre</Text>
        <TextInput
          placeholder="Entrez le titre"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Entrez la description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, styles.textarea]}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex]}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text>{date.toLocaleDateString('fr-FR')}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.inputGroup, styles.flex]}>
          <Text style={styles.label}>Heure</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateButton}>
            <Text>{time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" display="default" onChange={onTimeChange} />
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Répéter</Text>
        <View style={styles.segmentedControl}>
          {['none', 'daily', 'weekly'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.segment, repeat === item && styles.segmentSelected]}
              onPress={() => setRepeat(item as RepeatType)}
            >
              <Text style={[styles.segmentText, repeat === item && styles.segmentTextSelected]}>
                {item === 'none' ? 'Jamais' : item === 'daily' ? 'Tous les jours' : 'Toutes les semaines'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Priorité</Text>
        <View style={styles.segmentedControl}>
          {['low', 'medium', 'high'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.segment,
                priority === item && styles.segmentSelected,
              ]}
              onPress={() => setPriority(item as PriorityLevel)}
            >
              <Text
                style={[
                  styles.segmentText,
                  priority === item && styles.segmentTextSelected,
                ]}
              >
                {item === 'low' ? 'Basse' : item === 'medium' ? 'Moyenne' : 'Haute'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={loading}>
          <Text style={[styles.buttonText, styles.saveButtonText]}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: theme.spacing.l,
  },
  inputGroup: {
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: 16,
    marginBottom: theme.spacing.s,
    color: theme.colors.placeholder,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    fontSize: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  dateButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
  },
  segment: {
    flex: 1,
    padding: theme.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentSelected: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
  },
  segmentText: {
    fontSize: 16,
  },
  segmentTextSelected: {
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.l,
  },
  button: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.s,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.s,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
  },
});
