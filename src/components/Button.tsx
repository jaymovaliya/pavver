import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, layout, radius, spacing, typography } from '@/theme';

export type ButtonVariant = 'primary' | 'socialLight' | 'socialDark' | 'outline';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

interface VariantStyle {
  background: string;
  text: string;
  border?: string;
}

const variantStyles: Record<ButtonVariant, VariantStyle> = {
  primary: { background: colors.accent.brand, text: colors.text.onAccent },
  socialLight: { background: colors.text.primary, text: colors.bg.primary },
  socialDark: { background: colors.bg.secondary, text: colors.text.primary },
  outline: { background: 'transparent', text: colors.text.primary, border: colors.border.default },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  leftIcon,
  loading = false,
  disabled = false,
}: ButtonProps) {
  const v = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.background },
        v.border != null ? { borderWidth: 1, borderColor: v.border } : null,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text style={[typography.button, { color: v.text }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: layout.buttonHeightPrimary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
