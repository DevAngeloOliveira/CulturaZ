import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, touchTarget, typography } from '@/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  background?: string;
  tone?: 'light' | 'dark';
}

export const AppHeader = ({
  title,
  subtitle,
  onBack,
  rightSlot,
  style,
  background,
  tone = 'dark',
}: AppHeaderProps) => {
  const fg = tone === 'dark' ? colors.textPrimary : colors.white;
  const subFg = tone === 'dark' ? colors.textSecondary : 'rgba(255,255,255,0.7)';

  return (
    <View style={[styles.container, background ? { backgroundColor: background } : null, style]}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={fg} />
        </Pressable>
      ) : (
        <View style={styles.backButton} />
      )}
      <View style={styles.titleWrap}>
        <Text style={[styles.title, { color: fg }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: subFg }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.rightSlot}>{rightSlot}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: touchTarget + spacing.sm,
  },
  backButton: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typography.titleMd,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  rightSlot: {
    width: touchTarget,
    alignItems: 'flex-end',
  },
});
