import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { theme } from '@/constants/theme';

const AlarmScreen = () => {
  const router = useRouter();
  const { title, description, dateTime } = useLocalSearchParams();
  const time = new Date(dateTime as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value < -100) {
        opacity.value = withSpring(0);
        router.back();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/coffee.png')}
        style={styles.illustration}
      />
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.swipeUpContainer, animatedStyle]}>
          <Text style={styles.swipeUpText}>Glissez vers le haut pour désactiver</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.xl,
  },
  time: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: theme.spacing.s,
  },
  description: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
  swipeUpContainer: {
    position: 'absolute',
    bottom: 50,
  },
  swipeUpText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
});

export default AlarmScreen;
