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
import { colors, spacing, typography } from '@/theme';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError('Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen background={colors.background}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Entre para continuar garimpando.</Text>
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
              leftIcon="mail-outline"
            />
            <PasswordField
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-closed-outline"
              error={error ?? undefined}
            />
            <Pressable onPress={onNavigateToForgotPassword} hitSlop={4}>
              <Text style={styles.forgot}>Esqueci minha senha</Text>
            </Pressable>
          </View>

          <Button
            label="Entrar"
            size="lg"
            fullWidth
            loading={loading}
            onPress={handleSubmit}
            style={styles.submit}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Novo por aqui?</Text>
            <Pressable onPress={onNavigateToRegister} hitSlop={4}>
              <Text style={styles.registerLink}>Criar conta</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  title: {
    ...typography.displayMd,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
  },
  forgot: {
    ...typography.label,
    color: colors.secondary,
    alignSelf: 'flex-end',
  },
  submit: {
    marginTop: spacing.sm,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 'auto',
    paddingTop: spacing.md,
  },
  registerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
});
