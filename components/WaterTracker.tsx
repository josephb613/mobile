import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { Svg, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const WaterTracker = () => {
  const [progress, setProgress] = useState(0.72);
  const [intake, setIntake] = useState(320);
  const total = 3500;
  const waveAnimation = useSharedValue(0);

  React.useEffect(() => {
    waveAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, [waveAnimation]);

  const animatedProps = useAnimatedProps(() => {
    const waveHeight = 10;
    const waveLength = 200;

    const path = `M 0,${(1 - progress) * 120 + waveHeight * Math.sin(waveAnimation.value * 2 * Math.PI)} C ${waveLength / 4},${(1 - progress) * 120 - waveHeight} ${waveLength * 3 / 4},${(1 - progress) * 120 + waveHeight} ${waveLength},${(1 - progress) * 120} V 120 H 0 Z`;

    return {
      d: path,
    };
  });

  const addIntake = () => {
    const newIntake = intake + 250;
    setIntake(newIntake);
    setProgress(newIntake / total);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Svg height="120" width="100%" style={styles.svg}>
          <AnimatedPath animatedProps={animatedProps} fill={theme.colors.primary} />
        </Svg>
        <View style={styles.textContainer}>
          <Text style={styles.percentage}>{`${Math.round(progress * 100)}%`}</Text>
          <Text style={styles.volume}>{`${intake} ml of ${total} ml`}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={addIntake}>
        <Text style={styles.link}>Add 250ml</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    overflow: 'hidden',
    marginBottom: theme.spacing.s,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    padding: theme.spacing.m,
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  volume: {
    fontSize: 16,
    color: 'white',
  },
  link: {
    color: theme.colors.primary,
    textAlign: 'center',
  },
});

export default WaterTracker;
