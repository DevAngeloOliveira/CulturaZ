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
import { AppHeader } from '@/components/layout/AppHeader';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAuthStore } from '@/stores/auth.store';
import { colors, spacing, typography } from '@/theme';

interface RegisterScreenProps {
  onBack: () => void;
}

export const RegisterScreen = ({ onBack }: RegisterScreenProps) => {
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = name.length >= 2 && email.includes('@') && password.length >= 8;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO entrega 2: chamar POST /api/auth/register e tratar 409 (e-mail duplicado).
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen background={colors.background}>
      <AppHeader title="Criar conta" onBack={onBack} />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            <Text style={styles.title}>Vamos começar</Text>
            <Text style={styles.subtitle}>
              Em poucos passos você está pronto para comprar e vender no CulturaZ.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Nome completo"
              placeholder="Como devemos te chamar?"
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
              autoComplete="name"
            />
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
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-closed-outline"
              helper="Inclua letras e números para mais segurança."
            />
          </View>

          <View style={styles.terms}>
            <Text style={styles.termsText}>
              Ao criar conta, você concorda com nossos Termos de Uso e Política de Privacidade.
            </Text>
          </View>

          <Button
            label="Criar conta"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!isValid}
            onPress={handleSubmit}
            style={styles.submit}
          />

          <Pressable onPress={onBack} hitSlop={4} style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <Text style={styles.loginLink}>Entrar</Text>
          </Pressable>
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
  intro: {
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
  terms: {
    paddingHorizontal: spacing.xs,
  },
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  submit: {
    marginTop: spacing.xs,
  },
  loginRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
});
