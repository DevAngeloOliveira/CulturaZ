import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { TextField } from '@/components/forms/TextField';
import { AppScreen } from '@/components/layout/AppScreen';
import { useActivateSellerMutation, useSellerProfileQuery } from '@/hooks/api';
import { authApi } from '@/services/api';
import { forceRefreshSession } from '@/services/http';
import { useAuthStore } from '@/stores/auth.store';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import type { SellerProfileResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';

type SellerType = 'INDIVIDUAL' | 'BOOKSTORE' | 'SEBO';

const TYPES: { value: SellerType; label: string; description: string }[] = [
  {
    value: 'INDIVIDUAL',
    label: 'Vendedor individual',
    description: 'Pessoa física revendendo livros pessoais.',
  },
  {
    value: 'BOOKSTORE',
    label: 'Livraria',
    description: 'Loja com CNPJ e catálogo curado.',
  },
  {
    value: 'SEBO',
    label: 'Sebo',
    description: 'Especialista em obras usadas e raras.',
  },
];

export const ActivateSellerScreen = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addRole = useAuthStore((s) => s.addRole);
  const isAlreadySeller = !!user?.roles.includes('SELLER');

  const profileQuery = useSellerProfileQuery(isAuthenticated && isAlreadySeller);
  const activate = useActivateSellerMutation();

  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SellerType>('INDIVIDUAL');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (storeName.trim().length < 2) {
      setError('Informe um nome de loja com pelo menos 2 caracteres.');
      return;
    }
    try {
      await activate.mutateAsync({
        storeName: storeName.trim(),
        description: description.trim() || undefined,
        type,
      });
      // O JWT atual ainda foi emitido só com CUSTOMER; força refresh pra ganhar SELLER
      // antes que o RootNavigator monte SellerTabs e dispare chamadas autenticadas.
      const refreshed = await forceRefreshSession();
      if (refreshed) {
        try {
          const me = await authApi.me();
          useAuthStore.setState({ user: me, activeRole: 'SELLER' });
          return;
        } catch {
          // Fallback: atualiza só o estado local.
        }
      }
      addRole('SELLER');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!isAuthenticated) {
    return (
      <AppScreen>
        <View style={styles.center}>
          <Ionicons name="storefront-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.centerTitle}>Entre para vender</Text>
          <Text style={styles.centerDesc}>Faça login pra ativar seu perfil de vendedor.</Text>
        </View>
      </AppScreen>
    );
  }

  if (isAlreadySeller) {
    const profile: SellerProfileResponse | undefined = profileQuery.data;
    return (
      <AppScreen>
        <View style={styles.center}>
          <Ionicons name="checkmark-circle" size={48} color={colors.success} />
          <Text style={styles.centerTitle}>Vendedor já ativo</Text>
          <Text style={styles.centerDesc}>
            {profile
              ? `Sua loja "${profile.storeName}" está ${profile.status === 'ACTIVE' ? 'aprovada' : profile.status === 'PENDING_REVIEW' ? 'em análise' : 'suspensa'}.`
              : 'Mude para o perfil de vendedor pelo menu de perfil.'}
          </Text>
          <Button
            label="Ir para painel"
            onPress={() => useAuthStore.getState().switchRole('SELLER')}
            style={styles.cta}
          />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>Vender no CulturaZ</Text>
            <Text style={styles.title}>Ative seu perfil de vendedor.</Text>
            <Text style={styles.body}>
              Conte um pouco sobre a loja. Os anúncios passam por uma curadoria rápida antes de
              irem ao ar.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Nome da loja"
              placeholder="Ex.: Sebo do Bairro"
              value={storeName}
              onChangeText={setStoreName}
              autoCapitalize="words"
            />
            <TextField
              label="Descrição (opcional)"
              placeholder="O que faz sua loja especial?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.typesBlock}>
              <Text style={styles.typesLabel}>Tipo de loja</Text>
              {TYPES.map((t) => {
                const selected = type === t.value;
                return (
                  <Pressable
                    key={t.value}
                    onPress={() => setType(t.value)}
                    style={[styles.typeCard, selected ? styles.typeCardSelected : null]}
                  >
                    <View style={styles.typeBody}>
                      <Text style={styles.typeTitle}>{t.label}</Text>
                      <Text style={styles.typeDesc}>{t.description}</Text>
                    </View>
                    <Ionicons
                      name={selected ? 'radio-button-on' : 'radio-button-off'}
                      size={22}
                      color={selected ? colors.primary : colors.textSecondary}
                    />
                  </Pressable>
                );
              })}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Button
            label="Ativar vendedor"
            fullWidth
            loading={activate.isPending}
            onPress={onSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  intro: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.secondary,
  },
  title: {
    fontFamily: fontFamily.frauncesRegular,
    fontSize: 28,
    lineHeight: 32,
    color: colors.primary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
  },
  typesBlock: {
    gap: spacing.sm,
  },
  typesLabel: {
    ...typography.label,
    color: colors.primary,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    borderColor: colors.primary,
  },
  typeBody: {
    flex: 1,
    gap: 2,
  },
  typeTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  typeDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  centerTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  centerDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cta: {
    marginTop: spacing.md,
  },
});
