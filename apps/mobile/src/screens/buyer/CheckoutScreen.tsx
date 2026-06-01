import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { TextField } from '@/components/forms/TextField';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { toast } from '@/components/feedback/Toast';
import { AppScreen } from '@/components/layout/AppScreen';
import {
  useAddressesQuery,
  useCartQuery,
  useCreateAddressMutation,
  useCreateOrderMutation,
} from '@/hooks/api';
import { useAuthStore } from '@/stores/auth.store';
import { colors, radius, spacing, typography } from '@/theme';
import type { AddressResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL } from '@/utils/format';

import type { HomeStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<HomeStackParamList, 'Checkout'>;

interface AddressFormState {
  label: string;
  recipient: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
}

const emptyForm: AddressFormState = {
  label: 'Casa',
  recipient: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  postalCode: '',
};

const isFormValid = (f: AddressFormState): boolean =>
  f.recipient.trim().length >= 2 &&
  f.street.trim().length > 0 &&
  f.number.trim().length > 0 &&
  f.neighborhood.trim().length > 0 &&
  f.city.trim().length > 0 &&
  f.state.trim().length === 2 &&
  f.postalCode.trim().length >= 8;

export const CheckoutScreen = () => {
  const navigation = useNavigation<Navigation>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const cartQuery = useCartQuery(isAuthenticated);
  const addressesQuery = useAddressesQuery(isAuthenticated);
  const createAddress = useCreateAddressMutation();
  const createOrder = useCreateOrderMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [form, setForm] = useState<AddressFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const addresses = useMemo(() => addressesQuery.data ?? [], [addressesQuery.data]);
  const cart = cartQuery.data;

  useEffect(() => {
    if (selectedAddressId) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (def) setSelectedAddressId(def.id);
  }, [addresses, selectedAddressId]);

  const onSubmitNewAddress = async () => {
    setFormError(null);
    if (!isFormValid(form)) {
      setFormError('Preencha todos os campos corretamente (UF com 2 letras, CEP com 8 dígitos).');
      return;
    }
    try {
      const created = await createAddress.mutateAsync({
        ...form,
        recipient: form.recipient.trim(),
        street: form.street.trim(),
        number: form.number.trim(),
        neighborhood: form.neighborhood.trim(),
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        postalCode: form.postalCode.replace(/\D/g, ''),
        isDefault: true,
      });
      setSelectedAddressId(created.id);
      setForm(emptyForm);
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const onConfirmOrder = async () => {
    if (!selectedAddressId) return;
    try {
      const created = await createOrder.mutateAsync({
        shippingAddressId: selectedAddressId,
        paymentMethod: 'SIMULATED',
      });
      toast.success('Pedido confirmado!');
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Home' },
          { name: 'OrderDetails', params: { orderId: created.id } },
        ],
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const renderAddressCard = (address: AddressResponse) => {
    const selected = selectedAddressId === address.id;
    return (
      <Pressable
        key={address.id}
        onPress={() => setSelectedAddressId(address.id)}
        style={[styles.addressCard, selected ? styles.addressCardSelected : null]}
      >
        <View style={styles.addressHeader}>
          <Text style={styles.addressLabel}>{address.label}</Text>
          {address.isDefault ? <Text style={styles.defaultTag}>Padrão</Text> : null}
          <Ionicons
            name={selected ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={selected ? colors.primary : colors.textSecondary}
            style={styles.radio}
          />
        </View>
        <Text style={styles.addressText}>
          {address.recipient}
        </Text>
        <Text style={styles.addressText}>
          {address.street}, {address.number}
          {address.complement ? ` — ${address.complement}` : ''}
        </Text>
        <Text style={styles.addressText}>
          {address.neighborhood} · {address.city}/{address.state} · CEP {address.postalCode}
        </Text>
      </Pressable>
    );
  };

  const renderBody = () => {
    if (!isAuthenticated) {
      return (
        <ErrorState
          title="Sessão necessária"
          description="Faça login para finalizar o pedido."
        />
      );
    }
    if (cartQuery.isLoading || addressesQuery.isLoading) {
      return <LoadingState message="Preparando o resumo…" />;
    }
    if (cartQuery.isError || addressesQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(cartQuery.error ?? addressesQuery.error)}
          onRetry={() => {
            cartQuery.refetch();
            addressesQuery.refetch();
          }}
        />
      );
    }
    if (!cart || cart.items.length === 0) {
      return (
        <ErrorState
          title="Carrinho vazio"
          description="Adicione livros antes de finalizar."
        />
      );
    }

    const total = Number(cart.subtotalAmount) + 0;

    return (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de entrega</Text>
          {addresses.length > 0 ? (
            <View style={styles.addressList}>{addresses.map(renderAddressCard)}</View>
          ) : (
            <View style={styles.addressForm}>
              <Text style={styles.formHint}>
                Você ainda não tem endereço cadastrado. Cadastre um para continuar — depois é possível
                gerenciá-los pelo perfil.
              </Text>
              <TextField
                label="Rótulo"
                placeholder="Ex.: Casa, Trabalho"
                value={form.label}
                onChangeText={(v) => setForm({ ...form, label: v })}
              />
              <TextField
                label="Destinatário"
                placeholder="Nome completo"
                value={form.recipient}
                onChangeText={(v) => setForm({ ...form, recipient: v })}
                autoCapitalize="words"
              />
              <TextField
                label="Rua"
                value={form.street}
                onChangeText={(v) => setForm({ ...form, street: v })}
              />
              <View style={styles.row}>
                <TextField
                  label="Número"
                  value={form.number}
                  onChangeText={(v) => setForm({ ...form, number: v })}
                  keyboardType="number-pad"
                  containerStyle={styles.flex1}
                />
                <TextField
                  label="Bairro"
                  value={form.neighborhood}
                  onChangeText={(v) => setForm({ ...form, neighborhood: v })}
                  containerStyle={styles.flex2}
                />
              </View>
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
                placeholder="00000000"
                value={form.postalCode}
                onChangeText={(v) => setForm({ ...form, postalCode: v.replace(/\D/g, '') })}
                keyboardType="number-pad"
                maxLength={9}
              />
              {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
              <Button
                label="Salvar endereço"
                onPress={onSubmitNewAddress}
                loading={createAddress.isPending}
                fullWidth
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({cart.itemsCount} item(s))</Text>
              <Text style={styles.summaryValue}>{formatBRL(cart.subtotalAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frete</Text>
              <Text style={styles.summaryValue}>Simulado · R$ 0,00</Text>
            </View>
            <View style={styles.summarySeparator} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatBRL(total)}</Text>
            </View>
          </View>
          <Text style={styles.simulatedNote}>
            Pagamento simulado para esta fase do projeto.
          </Text>
        </View>
      </ScrollView>
    );
  };

  const canConfirm =
    isAuthenticated &&
    (cart?.items.length ?? 0) > 0 &&
    !!selectedAddressId &&
    !createOrder.isPending;

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.spacer} />
      </View>
      {renderBody()}
      <View style={styles.footer}>
        <Button
          label="Confirmar pedido"
          fullWidth
          disabled={!canConfirm}
          loading={createOrder.isPending}
          onPress={onConfirmOrder}
        />
      </View>
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
  addressList: {
    gap: spacing.sm,
  },
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 2,
  },
  addressCardSelected: {
    borderColor: colors.primary,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  addressLabel: {
    ...typography.titleSm,
    color: colors.textPrimary,
    flex: 1,
  },
  defaultTag: {
    ...typography.caption,
    color: colors.secondary,
  },
  radio: {
    marginLeft: spacing.xs,
  },
  addressText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  addressForm: {
    gap: spacing.sm,
  },
  formHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.textPrimary,
  },
  summarySeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.titleSm,
    color: colors.primary,
  },
  simulatedNote: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
