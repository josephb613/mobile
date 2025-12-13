import * as Notifications from 'expo-notifications';
import { Reminder } from '@/types/reminder';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Rappels',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        enableVibrate: true,
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

export const scheduleNotification = async (reminder: Reminder): Promise<string> => {
  try {
    const trigger = new Date(reminder.dateTime);
    
    let notificationTrigger: Notifications.NotificationTriggerInput;
    
    if (reminder.repeat === 'daily') {
      notificationTrigger = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: trigger.getHours(),
        minute: trigger.getMinutes(),
      };
    } else if (reminder.repeat === 'weekly') {
      notificationTrigger = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: trigger.getDay() + 1,
        hour: trigger.getHours(),
        minute: trigger.getMinutes(),
      };
    } else {
      notificationTrigger = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      };
    }
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.description || 'Rappel',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 250, 250, 250],
        data: { reminderId: reminder.id },
      },
      trigger: notificationTrigger,
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

export const setupNotificationHandler = () => {
  // Handle notification received while app is in foreground
  Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });
  
  // Handle notification tapped
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response:', response);
    // Navigate to reminder details if needed
  });
};