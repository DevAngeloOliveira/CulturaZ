import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/stores/auth.store';
import { colors, fontFamily, spacing } from '@/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const MIN_DISPLAY_MS = 1500;
const MAX_WAIT_MS = 10000;

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const status = useAuthStore((s) => s.status);
  const progress = useRef(new Animated.Value(0)).current;
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: MIN_DISPLAY_MS,
      useNativeDriver: false,
    }).start();
    const minTimer = setTimeout(() => setMinElapsed(true), MIN_DISPLAY_MS);
    const maxTimer = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [progress]);

  useEffect(() => {
    if (minElapsed && (status === 'unauthenticated' || timedOut)) {
      onFinish();
    }
  }, [minElapsed, timedOut, status, onFinish]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['14%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Cz</Text>
      </View>
      <View style={styles.brandBlock}>
        <Text style={styles.brand}>CulturaZ</Text>
        <Text style={styles.tagline}>Livros em circulação. Conhecimento em movimento.</Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: fillWidth }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    paddingHorizontal: spacing.xl,
  },
  logoBox: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: fontFamily.inter900,
    fontSize: 38,
    lineHeight: 46,
    color: colors.primary,
  },
  brandBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 252,
  },
  brand: {
    fontFamily: fontFamily.frauncesRegular,
    fontSize: 42,
    lineHeight: 46,
    color: colors.white,
  },
  tagline: {
    fontFamily: fontFamily.inter400,
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,253,247,0.72)',
    textAlign: 'center',
  },
  progressTrack: {
    width: 160,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
});
