import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors, spacing, typography } from '@/theme';

const { width } = Dimensions.get('window');

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    icon: 'library-outline',
    title: 'Catálogo completo',
    description: 'Encontre acadêmicos, técnicos, literatura e raros — tudo no mesmo lugar.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Vendedores avaliados',
    description: 'Sebos verificados, condição visível e reputação real de quem já comprou.',
  },
  {
    icon: 'sparkles-outline',
    title: 'Revenda sem complicação',
    description: 'Tem livros parados? Em poucos toques, ele entra na vitrine certa.',
  },
];

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen = ({ onFinish }: OnboardingScreenProps) => {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const handleNext = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      onFinish();
    }
  };

  return (
    <AppScreen>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={56} color={colors.primary} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === index ? colors.primary : colors.border, width: i === index ? 22 : 8 },
            ]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Pular" variant="ghost" size="md" onPress={onFinish} />
        <Button
          label={index === slides.length - 1 ? 'Começar' : 'Próximo'}
          variant="primary"
          size="md"
          onPress={handleNext}
          rightIcon="arrow-forward"
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.displayMd,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginVertical: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
