import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { colors, radius, shadows, spacing, typography } from '@/theme';

export type ToastTone = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  durationMs: number;
}

interface ToastState {
  toasts: ToastItem[];
  show: (message: string, tone?: ToastTone, durationMs?: number) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, tone = 'info', durationMs = 2800) => {
    toastId += 1;
    const id = toastId;
    set((state) => ({ toasts: [...state.toasts, { id, message, tone, durationMs }] }));
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  show: (message: string, tone: ToastTone = 'info') => useToastStore.getState().show(message, tone),
  success: (message: string) => useToastStore.getState().show(message, 'success'),
  error: (message: string) => useToastStore.getState().show(message, 'error'),
  info: (message: string) => useToastStore.getState().show(message, 'info'),
};

const TONE_STYLES: Record<ToastTone, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  success: { bg: colors.primary, fg: colors.white, icon: 'checkmark-circle-outline' },
  error: { bg: colors.error, fg: colors.white, icon: 'alert-circle-outline' },
  info: { bg: colors.textPrimary, fg: colors.white, icon: 'information-circle-outline' },
};

interface ToastRowProps {
  item: ToastItem;
  onDismiss: (id: number) => void;
}

const ToastRow = ({ item, onDismiss }: ToastRowProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(translate, { toValue: 20, duration: 220, useNativeDriver: true }),
      ]).start(() => onDismiss(item.id));
    }, item.durationMs);
    return () => clearTimeout(timer);
  }, [opacity, translate, item.id, item.durationMs, onDismiss]);

  const palette = TONE_STYLES[item.tone];

  return (
    <Animated.View
      style={[
        styles.toast,
        shadows.sm,
        { backgroundColor: palette.bg, opacity, transform: [{ translateY: translate }] },
      ]}
    >
      <Ionicons name={palette.icon} size={20} color={palette.fg} />
      <Text style={[styles.message, { color: palette.fg }]} numberOfLines={2}>
        {item.message}
      </Text>
      <Pressable onPress={() => onDismiss(item.id)} hitSlop={6}>
        <Ionicons name="close" size={18} color={palette.fg} />
      </Pressable>
    </Animated.View>
  );
};

export const ToastHost = () => {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <SafeAreaView edges={['bottom']} pointerEvents="box-none" style={styles.host}>
      <View pointerEvents="box-none" style={styles.stack}>
        {toasts.map((item) => (
          <ToastRow key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  stack: {
    width: '100%',
    gap: spacing.xs,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  message: {
    ...typography.body,
    flex: 1,
  },
});
