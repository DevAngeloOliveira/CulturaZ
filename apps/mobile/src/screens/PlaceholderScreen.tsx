import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { colors, spacing, typography } from '@/theme';

interface PlaceholderScreenProps {
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const PlaceholderScreen = ({
  title,
  message = 'Esta tela faz parte de uma próxima entrega. Veja docs/roadmap.md.',
  icon = 'construct-outline',
}: PlaceholderScreenProps) => (
  <AppScreen>
    <View style={styles.center}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  </AppScreen>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.titleLg,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
