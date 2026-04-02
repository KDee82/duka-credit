import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';
import { radius, spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';

const variants = {
  primary: {
    bg: COLORS.navy,
    text: COLORS.white,
    ripple: 'rgba(255,255,255,0.15)',
    shadow: shadows.md,
  },
  secondary: {
    bg: COLORS.gold,
    text: COLORS.navy,
    ripple: 'rgba(15,31,61,0.1)',
    shadow: shadows.sm,
  },
  ghost: {
    bg: 'transparent',
    text: COLORS.navy,
    ripple: 'rgba(15,31,61,0.08)',
    border: COLORS.navy,
    shadow: {},
  },
  danger: {
    bg: COLORS.coral,
    text: COLORS.white,
    ripple: 'rgba(255,255,255,0.15)',
    shadow: shadows.sm,
  },
};

const sizes = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, minHeight: 40 },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 52 },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl, minHeight: 60 },
};

export default function DukaButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}) {
  const v = variants[variant];
  const s = sizes[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      android_ripple={{ color: v.ripple }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        s,
        v.shadow,
        { backgroundColor: v.bg, borderRadius: radius.lg },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : null,
        isDisabled && { opacity: 0.55 },
        pressed && { opacity: 0.9 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={[styles.label, typography.labelLarge, { color: v.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    textAlign: 'center',
  },
});
