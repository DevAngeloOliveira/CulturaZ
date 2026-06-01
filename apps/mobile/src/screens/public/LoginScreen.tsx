import { StatusBar } from 'expo-status-bar';
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
import { PasswordField } from '@/components/forms/PasswordField';
import { TextField } from '@/components/forms/TextField';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAuthStore } from '@/stores/auth.store';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export const LoginScreen = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
}: LoginScreenProps) => {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 3 && password.length >= 1;

  const handleSubmit = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível entrar. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>Bem-vindo de volta</Text>
              <Text style={styles.title}>Entre na sua biblioteca circular.</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Cz</Text>
            </View>
          </View>

          <View style={styles.form}>
            <TextField
              label="E-mail"
              placeholder="voce@exemplo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
            <PasswordField
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.metaRow}>
              <Pressable
                onPress={() => setRemember((v) => !v)}
                style={[styles.remember, remember ? styles.rememberOn : styles.rememberOff]}
              >
                <Text style={styles.rememberText}>Lembrar</Text>
              </Pressable>
              <Pressable onPress={onNavigateToForgotPassword} hitSlop={6}>
                <Text style={styles.link}>Esqueci a senha</Text>
              </Pressable>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <View style={styles.actions}>
            <Button
              label="Entrar"
              fullWidth
              loading={loading}
              disabled={!canSubmit}
              onPress={handleSubmit}
            />
            <Button
              label="Criar conta"
              variant="secondary"
              fullWidth
              onPress={onNavigateToRegister}
            />
          </View>

          <Text style={styles.footer}>Acesse catálogo, carrinho, pedidos e área de venda.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: spacing.md,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fontFamily.frauncesRegular,
    fontSize: 33,
    lineHeight: 36,
    color: colors.primary,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm + 3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fontFamily.inter900,
    fontSize: 16,
    color: colors.primary,
  },
  form: {
    gap: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remember: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  rememberOn: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  rememberOff: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  rememberText: {
    ...typography.label,
    color: colors.primary,
  },
  link: {
    ...typography.label,
    color: colors.textSecondary,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
  actions: {
    gap: spacing.sm,
  },
  footer: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: spacing.sm,
  },
});
