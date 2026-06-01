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
import { IconButton } from '@/components/buttons/IconButton';
import { PasswordField } from '@/components/forms/PasswordField';
import { TextField } from '@/components/forms/TextField';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAuthStore } from '@/stores/auth.store';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';

interface RegisterScreenProps {
  onBack: () => void;
  onSignIn: () => void;
}

export const RegisterScreen = ({ onBack, onSignIn }: RegisterScreenProps) => {
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = name.trim().length >= 2 && email.includes('@') && password.length >= 8;

  const handleSubmit = async () => {
    if (loading || !isValid) return;
    setError(null);
    setLoading(true);
    try {
      const trimmedPhone = phone.trim();
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        ...(trimmedPhone ? { phone: trimmedPhone } : {}),
      });
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar a conta. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={onBack} />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>Nova conta</Text>
            <Text style={styles.title}>Crie seu acesso ao CulturaZ.</Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Nome"
              placeholder="Seu nome completo"
              value={name}
              onChangeText={setName}
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
            />
            <TextField
              label="Telefone"
              placeholder="(11) 99999-0000"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
            <PasswordField
              label="Senha"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={setPassword}
              helper="Inclua letras e números para mais segurança."
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <Button
            label="Cadastrar"
            fullWidth
            loading={loading}
            disabled={!isValid}
            onPress={handleSubmit}
          />

          <View style={styles.note}>
            <Text style={styles.noteText}>
              Depois você pode ativar seu perfil de vendedor na área de perfil.
            </Text>
          </View>

          <Pressable onPress={onSignIn} hitSlop={6} style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <Text style={styles.loginLink}>Entrar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  intro: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fontFamily.frauncesRegular,
    fontSize: 33,
    lineHeight: 37,
    color: colors.primary,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
  note: {
    backgroundColor: colors.mint,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  noteText: {
    ...typography.caption,
    color: colors.primary,
  },
  loginRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: spacing.xs,
    marginTop: 'auto',
    paddingTop: spacing.sm,
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
