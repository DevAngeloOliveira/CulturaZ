import { StyleSheet, View } from 'react-native';

import { QuickActionCard } from '@/components/cards/QuickActionCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/theme';

interface QuickAction {
  id: string;
  icon: Parameters<typeof QuickActionCard>[0]['icon'];
  label: string;
  description?: string;
  tone?: 'primary' | 'accent';
  onPress?: () => void;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export const QuickActionsGrid = ({ actions }: QuickActionsGridProps) => (
  <>
    <SectionHeader title="Ações rápidas" />
    <View style={styles.grid}>
      {actions.map((action) => (
        <View key={action.id} style={styles.cell}>
          <QuickActionCard
            icon={action.icon}
            label={action.label}
            description={action.description}
            tone={action.tone}
            onPress={action.onPress}
          />
        </View>
      ))}
    </View>
  </>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  cell: {
    flexBasis: '48%',
    flexGrow: 1,
  },
});
