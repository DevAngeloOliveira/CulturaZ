import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { TextField } from '@/components/forms/TextField';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppScreen } from '@/components/layout/AppScreen';
import {
  useAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useUpdateAddressMutation,
} from '@/hooks/api';
import { useAuthStore } from '@/stores/auth.store';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { AddressRequest, AddressResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';

interface FormState {
  label: string;
  recipient: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const emptyForm: FormState = {
  label: 'Casa',
  recipient: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  postalCode: '',
  isDefault: false,
};

const toForm = (a: AddressResponse): FormState => ({
  label: a.label,
  recipient: a.recipient,
  street: a.street,
  number: a.number,
  complement: a.complement ?? '',
  neighborhood: a.neighborhood,
  city: a.city,
  state: a.state,
  postalCode: a.postalCode,
  isDefault: a.isDefault,
});

const isValid = (f: FormState): boolean =>
  f.label.trim().length > 0 &&
  f.recipient.trim().length >= 2 &&
  f.street.trim().length > 0 &&
  f.number.trim().length > 0 &&
  f.neighborhood.trim().length > 0 &&
  f.city.trim().length > 0 &&
  f.state.trim().length === 2 &&
  f.postalCode.replace(/\D/g, '').length >= 8;

const toRequest = (f: FormState): AddressRequest => ({
  label: f.label.trim(),
  recipient: f.recipient.trim(),
  street: f.street.trim(),
  number: f.number.trim(),
  complement: f.complement.trim() || undefined,
  neighborhood: f.neighborhood.trim(),
  city: f.city.trim(),
  state: f.state.trim().toUpperCase(),
  postalCode: f.postalCode.replace(/\D/g, ''),
  isDefault: f.isDefault,
});

export const AddressesScreen = () => {
  const navigation = useNavigation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const addressesQuery = useAddressesQuery(isAuthenticated);
  const createAddress = useCreateAddressMutation();
  const updateAddress = useUpdateAddressMutation();
  const deleteAddress = useDeleteAddressMutation();
  const setDefault = useSetDefaultAddressMutation();

  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<AddressResponse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, isDefault: (addressesQuery.data?.length ?? 0) === 0 });
    setError(null);
    setMode('form');
  };

  const startEdit = (a: AddressResponse) => {
    setEditing(a);
    setForm(toForm(a));
    setError(null);
    setMode('form');
  };

  const backToList = () => {
    setMode('list');
    setEditing(null);
    setError(null);
  };

  const onSave = async () => {
    setError(null);
    if (!isValid(form)) {
      setError('Preencha todos os campos (UF com 2 letras, CEP com 8 dígitos).');
      return;
    }
    try {
      const body = toRequest(form);
      if (editing) {
        await updateAddress.mutateAsync({ id: editing.id, body });
      } else {
        await createAddress.mutateAsync(body);
      }
      backToList();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const onDelete = (address: AddressResponse) => {
    Alert.alert('Remover endereço?', `"${address.label}" será apagado.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () =>
          deleteAddress.mutate(address.id, {
            onError: (err) => Alert.alert('Não foi possível remover', getErrorMessage(err)),
          }),
      },
    ]);
  };

  const onSetDefault = (address: AddressResponse) => {
    if (address.isDefault) return;
    setDefault.mutate(address.id, {
      onError: (err) => Alert.alert('Falha ao definir padrão', getErrorMessage(err)),
    });
  };

  const renderItem = ({ item }: { item: AddressResponse }) => (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.cardHeader}>
        <Text style={styles.label}>{item.label}</Text>
        {item.isDefault ? <Text style={styles.defaultTag}>Padrão</Text> : null}
      </View>
      <Text style={styles.line}>{item.recipient}</Text>
      <Text style={styles.line}>
        {item.street}, {item.number}
        {item.complement ? ` — ${item.complement}` : ''}
      </Text>
      <Text style={styles.line}>
        {item.neighborhood} · {item.city}/{item.state} · CEP {item.postalCode}
      </Text>
      <View style={styles.actions}>
        {!item.isDefault ? (
          <Pressable onPress={() => onSetDefault(item)} hitSlop={6} style={styles.actionBtn}>
            <Ionicons name="star-outline" size={16} color={colors.primary} />
            <Text style={styles.actionLabel}>Tornar padrão</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => startEdit(item)} hitSlop={6} style={styles.actionBtn}>
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={styles.actionLabel}>Editar</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(item)} hitSlop={6} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={[styles.actionLabel, styles.actionLabelDanger]}>Remover</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderListBody = () => {
    if (!isAuthenticated) {
      return (
        <EmptyState
          icon="location-outline"
          title="Sessão necessária"
          description="Entre para gerenciar seus endereços."
        />
      );
    }
    if (addressesQuery.isLoading) return <LoadingState message="Carregando endereços…" />;
    if (addressesQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(addressesQuery.error)}
          onRetry={() => addressesQuery.refetch()}
        />
      );
    }
    const data = addressesQuery.data ?? [];
    if (data.length === 0) {
      return (
        <EmptyState
          icon="location-outline"
          title="Sem endereços cadastrados"
          description="Adicione um endereço para usar no checkout."
        />
      );
    }
    return (
      <FlatList
        data={data}
        keyExtractor={(a) => a.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        refreshing={addressesQuery.isRefetching}
        onRefresh={() => addressesQuery.refetch()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderForm = () => (
    <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.formTitle}>{editing ? 'Editar endereço' : 'Novo endereço'}</Text>

      <TextField label="Rótulo" value={form.label} onChangeText={(v) => setForm({ ...form, label: v })} />
      <TextField
        label="Destinatário"
        value={form.recipient}
        onChangeText={(v) => setForm({ ...form, recipient: v })}
        autoCapitalize="words"
      />
      <TextField label="Rua" value={form.street} onChangeText={(v) => setForm({ ...form, street: v })} />
      <View style={styles.row}>
        <TextField
          label="Número"
          value={form.number}
          onChangeText={(v) => setForm({ ...form, number: v })}
          keyboardType="number-pad"
          containerStyle={styles.flex1}
        />
        <TextField
          label="Complemento"
          value={form.complement}
          onChangeText={(v) => setForm({ ...form, complement: v })}
          containerStyle={styles.flex2}
        />
      </View>
      <TextField
        label="Bairro"
        value={form.neighborhood}
        onChangeText={(v) => setForm({ ...form, neighborhood: v })}
      />
      <View style={styles.row}>
        <TextField
          label="Cidade"
          value={form.city}
          onChangeText={(v) => setForm({ ...form, city: v })}
          containerStyle={styles.flex2}
        />
        <TextField
          label="UF"
          value={form.state}
          onChangeText={(v) => setForm({ ...form, state: v.toUpperCase().slice(0, 2) })}
          autoCapitalize="characters"
          maxLength={2}
          containerStyle={styles.flex1}
        />
      </View>
      <TextField
        label="CEP"
        value={form.postalCode}
        onChangeText={(v) => setForm({ ...form, postalCode: v.replace(/\D/g, '') })}
        keyboardType="number-pad"
        maxLength={9}
      />

      <Pressable
        onPress={() => setForm({ ...form, isDefault: !form.isDefault })}
        style={styles.checkboxRow}
      >
        <Ionicons
          name={form.isDefault ? 'checkbox' : 'square-outline'}
          size={22}
          color={form.isDefault ? colors.primary : colors.textSecondary}
        />
        <Text style={styles.checkboxLabel}>Definir como endereço padrão</Text>
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.formActions}>
        <Button label="Cancelar" variant="outline" fullWidth onPress={backToList} style={styles.flex1} />
        <Button
          label="Salvar"
          fullWidth
          loading={createAddress.isPending || updateAddress.isPending}
          onPress={onSave}
          style={styles.flex1}
        />
      </View>
    </ScrollView>
  );

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton
          icon="chevron-back"
          color={colors.primary}
          onPress={() => (mode === 'form' ? backToList() : navigation.goBack())}
        />
        <Text style={styles.headerTitle}>Endereços</Text>
        {mode === 'list' && isAuthenticated ? (
          <IconButton icon="add" color={colors.primary} onPress={startCreate} />
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
      {mode === 'list' ? renderListBody() : renderForm()}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  spacer: {
    width: 44,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.titleSm,
    color: colors.textPrimary,
    flex: 1,
  },
  defaultTag: {
    ...typography.caption,
    color: colors.secondary,
  },
  line: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
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
  actionLabelDanger: {
    color: colors.error,
  },
  formScroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  formTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
