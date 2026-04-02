import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

function formatKES(amount) {
  const num = parseFloat(amount) || 0;
  return 'KES ' + num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const variantColors = {
  owed: COLORS.coral,
  paid: COLORS.emerald,
  neutral: COLORS.navy,
};

export default function AmountDisplay({ amount, label, variant = 'neutral', style }) {
  const color = variantColors[variant] || COLORS.navy;
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={[styles.label, typography.labelMedium]}>{label}</Text> : null}
      <Text style={[styles.amount, typography.amountHero, { color }]}>{formatKES(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  label: {
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  amount: {},
});
