import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/buttons/Button';
import { TextField } from '@/components/forms/TextField';
import { Badge } from '@/components/feedback/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import {
  useActivateCategoryMutation,
  useAdminCategoriesQuery,
  useCreateCategoryMutation,
  useDeactivateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/hooks/api';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { CategoryResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';

interface FormState {
  name: string;
  description: string;
  icon: string;
}

const emptyForm: FormState = { name: '', description: '', icon: '' };

export const AdminCategoriesScreen = () => {
  const categoriesQuery = useAdminCategoriesQuery();
  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();
  const activateCategory = useActivateCategoryMutation();
  const deactivateCategory = useDeactivateCategoryMutation();

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setFormVisible(true);
  };

  const openEdit = (cat: CategoryResponse) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description ?? '',
      icon: cat.icon ?? '',
    });
    setError(null);
    setFormVisible(true);
  };

  const onSave = async () => {
    setError(null);
    if (form.name.trim().length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres.');
      return;
    }
    const body = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      icon: form.icon.trim() || undefined,
    };
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, body });
      } else {
        await createCategory.mutateAsync(body);
      }
      setFormVisible(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const toggleActive = (cat: CategoryResponse) => {
    const action = cat.active ? deactivateCategory : activateCategory;
    action.mutate(cat.id, {
      onError: (err) => Alert.alert('Falha', getErrorMessage(err)),
    });
  };

  const renderItem = ({ item }: { item: CategoryResponse }) => (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.cardHead}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
        <Badge label={item.active ? 'Ativa' : 'Inativa'} tone={item.active ? 'success' : 'neutral'} />
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => openEdit(item)} hitSlop={6} style={styles.actionBtn}>
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={styles.actionLabel}>Editar</Text>
        </Pressable>
        <Pressable onPress={() => toggleActive(item)} hitSlop={6} style={styles.actionBtn}>
          <Ionicons
            name={item.active ? 'pause-outline' : 'play-outline'}
            size={16}
            color={colors.primary}
          />
          <Text style={styles.actionLabel}>{item.active ? 'Desativar' : 'Ativar'}</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderBody = () => {
    if (categoriesQuery.isLoading) return <LoadingState message="Carregando categorias…" />;
    if (categoriesQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(categoriesQuery.error)}
          onRetry={() => categoriesQuery.refetch()}
        />
      );
    }
    const items = categoriesQuery.data ?? [];
    if (items.length === 0) {
      return (
        <EmptyState
          icon="pricetags-outline"
          title="Sem categorias"
          description="Toque no + para criar a primeira."
        />
      );
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(c) => c.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        refreshing={categoriesQuery.isRefetching}
        onRefresh={() => categoriesQuery.refetch()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Categorias</Text>
        <Pressable
          onPress={openCreate}
          style={({ pressed }) => [styles.fab, pressed ? { opacity: 0.85 } : null]}
          hitSlop={6}
        >
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>
      {renderBody()}

      <Modal visible={formVisible} animationType="slide" transparent>
        <Pressable style={styles.modalBackdrop} onPress={() => setFormVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{editing ? 'Editar categoria' : 'Nova categoria'}</Text>
            <TextField
              label="Nome"
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              autoCapitalize="words"
            />
            <TextField
              label="Descrição"
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
              multiline
              numberOfLines={3}
            />
            <TextField
              label="Ícone (Ionicon)"
              placeholder="Ex.: book-outline"
              value={form.icon}
              onChangeText={(v) => setForm({ ...form, icon: v })}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.modalActions}>
              <Button
                label="Cancelar"
                variant="outline"
                onPress={() => setFormVisible(false)}
                style={styles.flex1}
              />
              <Button
                label="Salvar"
                loading={createCategory.isPending || updateCategory.isPending}
                onPress={onSave}
                style={styles.flex1}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: { ...typography.titleLg, color: colors.textPrimary },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: { height: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionLabel: {
    ...typography.label,
    color: colors.primary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    gap: spacing.sm,
  },
  modalTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  flex1: { flex: 1 },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
});
