import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { TextField } from '@/components/forms/TextField';
import { toast } from '@/components/feedback/Toast';
import { AppScreen } from '@/components/layout/AppScreen';
import { useUpdateProfileMutation } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth.store';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';

import type { ProfileStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'C';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts.at(-1)!.charAt(0)).toUpperCase();
};

export const ProfileScreen = () => {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useUpdateProfileMutation();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  useEffect(() => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
  }, [user?.name, user?.phone]);

  if (!user) {
    return (
      <AppScreen>
        <View style={styles.center}>
          <Ionicons name="person-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.centerTitle}>Sessão necessária</Text>
          <Text style={styles.centerDesc}>Entre para acessar seu perfil.</Text>
        </View>
      </AppScreen>
    );
  }

  const isDirty = name.trim() !== user.name || (phone.trim() || '') !== (user.phone ?? '');
  const canSave = name.trim().length >= 2 && isDirty && !updateProfile.isPending;

  const onSave = async () => {
    const trimmedPhone = phone.trim();
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        ...(trimmedPhone ? { phone: trimmedPhone } : {}),
      });
      toast.success('Dados atualizados.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onLogout = () => {
    Alert.alert('Sair da conta?', 'Você precisará entrar novamente para usar o CulturaZ.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(user.name)}</Text>
          </View>
          <View style={styles.headerBody}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus dados</Text>
          <TextField
            label="Nome"
            value={name}
            onChangeText={setName}
            autoComplete="name"
          />
          <TextField
            label="E-mail"
            value={user.email}
            editable={false}
            helper="O e-mail não pode ser alterado por aqui."
          />
          <TextField
            label="Telefone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            placeholder="(11) 99999-0000"
          />
          <Button
            label="Salvar alterações"
            fullWidth
            disabled={!canSave}
            loading={updateProfile.isPending}
            onPress={onSave}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mais</Text>

          <Pressable
            onPress={() => navigation.navigate('Addresses')}
            style={({ pressed }) => [styles.row, shadows.sm, pressed ? { opacity: 0.92 } : null]}
          >
            <View style={styles.rowIcon}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Endereços</Text>
              <Text style={styles.rowDesc}>Gerencie locais de entrega.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={() =>
              Alert.alert(
                'Vender no CulturaZ',
                'Ative seu perfil de vendedor pela aba "Vender". Em breve esse atalho leva direto pro formulário.',
              )
            }
            style={({ pressed }) => [styles.row, shadows.sm, pressed ? { opacity: 0.92 } : null]}
          >
            <View style={[styles.rowIcon, styles.rowIconAccent]}>
              <Ionicons name="storefront-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Ativar perfil de vendedor</Text>
              <Text style={styles.rowDesc}>Comece a anunciar seus livros.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Button
          label="Sair"
          variant="outline"
          fullWidth
          leftIcon="log-out-outline"
          onPress={onLogout}
          style={styles.logout}
        />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.titleLg,
    color: colors.white,
  },
  headerBody: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  email: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconAccent: {
    backgroundColor: colors.mint,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  rowDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  logout: {
    marginTop: spacing.md,
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
  },
  centerDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
