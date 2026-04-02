import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { shadows } from '../theme/shadows';

const variantStyles = {
  primary: {
    bg: COLORS.navy,
    text: COLORS.white,
    border: COLORS.navy,
  },
  secondary: {
    bg: COLORS.gold,
    text: COLORS.navy,
    border: COLORS.gold,
  },
  ghost: {
    bg: 'transparent',
    text: COLORS.navy,
    border: COLORS.navy,
  },
  danger: {
    bg: COLORS.coral,
    text: COLORS.white,
    border: COLORS.coral,
  },
};

const sizeStyles = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 13, borderRadius: 8 },
  md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 15, borderRadius: 12 },
  lg: { paddingVertical: 18, paddingHorizontal: 24, fontSize: 17, borderRadius: 14 },
};

const DukaButton = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.borderRadius,
        },
        variant === 'primary' && shadows.md,
        pressed && variant === 'primary' && shadows.gold,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={[styles.label, { color: v.text, fontSize: s.fontSize }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  label: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textAlign: 'center',
  },
  disabled: { opacity: 0.55 },
});

export default DukaButton;
