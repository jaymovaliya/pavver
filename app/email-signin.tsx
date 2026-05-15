import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useUserStore } from '@/state/userStore';
import { colors, radius, spacing, typography } from '@/theme';

type Mode = 'signin' | 'signup';

const INPUT_HEIGHT = 56;
const MIN_PASSWORD = 6;

export default function EmailSignInScreen() {
  const router = useRouter();
  const signInWithEmailPassword = useUserStore((s) => s.signInWithEmailPassword);

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => email.includes('@') && password.length >= MIN_PASSWORD,
    [email, password],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || loading) return;
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithEmailPassword(email.trim(), password, mode);
      // AuthGate redirects to /profile-setup once status flips.
    } catch (err) {
      setErrorMsg(prettifyFirebaseError(err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }, [canSubmit, loading, signInWithEmailPassword, email, password, mode]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'signup' ? 'signin' : 'signup'));
    setErrorMsg(null);
  }, []);

  const submitLabel = mode === 'signup' ? 'Create account' : 'Sign in';
  const toggleLabel =
    mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account';

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[typography.body, styles.backText]}>← Back</Text>
        </Pressable>

        <View style={styles.headerWrap}>
          <Text style={[typography.h2, styles.headline]}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={[typography.bodySmall, styles.sub]}>
            {mode === 'signup'
              ? 'Use any email. We just need somewhere to send your magic link later.'
              : 'Sign in with the email + password you signed up with.'}
          </Text>
        </View>

        <View style={styles.fields}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            editable={!loading}
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder={`${MIN_PASSWORD}+ characters`}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            textContentType={mode === 'signup' ? 'newPassword' : 'password'}
            editable={!loading}
          />
          {errorMsg != null && (
            <Text style={[typography.bodySmall, styles.error]}>{errorMsg}</Text>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            label={submitLabel}
            onPress={handleSubmit}
            variant="primary"
            loading={loading}
            disabled={!canSubmit}
          />
          <Pressable
            onPress={toggleMode}
            disabled={loading}
            style={styles.toggle}
            accessibilityRole="button"
          >
            <Text style={[typography.bodySmall, styles.toggleText]}>{toggleLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

interface FieldProps extends TextInputProps {
  label: string;
}

function Field({ label, style, ...inputProps }: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[typography.overline, styles.fieldLabel]}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.text.tertiary}
        {...inputProps}
      />
    </View>
  );
}

function prettifyFirebaseError(message: string): string {
  if (message.includes('auth/email-already-in-use')) {
    return 'That email is already in use. Try signing in instead.';
  }
  if (
    message.includes('auth/invalid-credential') ||
    message.includes('auth/wrong-password') ||
    message.includes('auth/user-not-found')
  ) {
    return "Email or password didn't match.";
  }
  if (message.includes('auth/weak-password')) {
    return `Password must be at least ${MIN_PASSWORD} characters.`;
  }
  if (message.includes('auth/invalid-email')) {
    return "That doesn't look like a valid email address.";
  }
  if (message.includes('auth/network-request-failed')) {
    return 'Network error. Check your connection and try again.';
  }
  return message;
}

const styles = StyleSheet.create({
  kav: { flex: 1 },
  back: {
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backText: {
    color: colors.text.secondary,
  },
  headerWrap: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  headline: {
    color: colors.text.primary,
  },
  sub: {
    color: colors.text.secondary,
  },
  fields: {
    flex: 1,
    marginTop: spacing.xxl,
    gap: spacing.base,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldLabel: {
    color: colors.text.tertiary,
  },
  input: {
    height: INPUT_HEIGHT,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    color: colors.text.primary,
    fontSize: 16,
  },
  error: {
    color: colors.semantic.danger,
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  toggle: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggleText: {
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});
