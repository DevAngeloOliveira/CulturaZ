import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { SelectChip } from '@/components/forms/SelectChip';
import { TextField } from '@/components/forms/TextField';
import { AppScreen } from '@/components/layout/AppScreen';
import { useCategoriesQuery } from '@/hooks/api';
import { useCatalogStore, type CatalogFilters } from '@/stores/catalog.store';
import { colors, spacing, typography } from '@/theme';
import type { ListingCondition } from '@/types/api';
import { formatCondition } from '@/utils/format';

const CONDITIONS: ListingCondition[] = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'DAMAGED'];

const parseMoney = (value: string): number | undefined => {
  const trimmed = value.replace(',', '.').trim();
  if (!trimmed) return undefined;
  const n = Number.parseFloat(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export const FiltersScreen = () => {
  const navigation = useNavigation();
  const current = useCatalogStore((s) => s.filters);
  const setFilters = useCatalogStore((s) => s.setFilters);

  const categoriesQuery = useCategoriesQuery();
  const categories = (categoriesQuery.data ?? []).filter((c) => c.active);

  const [draft, setDraft] = useState<CatalogFilters>(current);
  const [priceMinText, setPriceMinText] = useState(
    current.priceMin !== undefined ? String(current.priceMin) : '',
  );
  const [priceMaxText, setPriceMaxText] = useState(
    current.priceMax !== undefined ? String(current.priceMax) : '',
  );

  const update = (patch: Partial<CatalogFilters>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const apply = () => {
    setFilters({
      ...draft,
      priceMin: parseMoney(priceMinText),
      priceMax: parseMoney(priceMaxText),
      city: draft.city?.trim() || undefined,
      state: draft.state?.trim() ? draft.state.trim().toUpperCase().slice(0, 2) : undefined,
    });
    navigation.goBack();
  };

  const clear = () => {
    setDraft({});
    setPriceMinText('');
    setPriceMaxText('');
  };

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Filtros</Text>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoria</Text>
          <View style={styles.chips}>
            <SelectChip
              label="Todas"
              selected={!draft.categoryId}
              onPress={() => update({ categoryId: undefined })}
            />
            {categories.map((cat) => (
              <SelectChip
                key={cat.id}
                label={cat.name}
                selected={draft.categoryId === cat.id}
                onPress={() => update({ categoryId: cat.id })}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condição</Text>
          <View style={styles.chips}>
            <SelectChip
              label="Todas"
              selected={!draft.condition}
              onPress={() => update({ condition: undefined })}
            />
            {CONDITIONS.map((cond) => (
              <SelectChip
                key={cond}
                label={formatCondition(cond)}
                selected={draft.condition === cond}
                onPress={() => update({ condition: cond })}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preço</Text>
          <View style={styles.priceRow}>
            <TextField
              label="Mínimo"
              placeholder="R$ 0"
              value={priceMinText}
              onChangeText={setPriceMinText}
              keyboardType="decimal-pad"
              containerStyle={styles.priceField}
            />
            <TextField
              label="Máximo"
              placeholder="R$ —"
              value={priceMaxText}
              onChangeText={setPriceMaxText}
              keyboardType="decimal-pad"
              containerStyle={styles.priceField}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <TextField
            label="Cidade"
            placeholder="Ex.: São Paulo"
            value={draft.city ?? ''}
            onChangeText={(v) => update({ city: v })}
            autoCapitalize="words"
          />
          <TextField
            label="UF"
            placeholder="Ex.: SP"
            value={draft.state ?? ''}
            onChangeText={(v) => update({ state: v.toUpperCase().slice(0, 2) })}
            autoCapitalize="characters"
            maxLength={2}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Limpar" variant="outline" fullWidth onPress={clear} style={styles.flex} />
        <Button label="Aplicar" fullWidth onPress={apply} style={styles.flex} />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priceField: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
});
