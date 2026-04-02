import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { formatKES } from '../utils/formatters';

const VARIANT_COLORS = {
  owed: COLORS.coral,
  paid: COLORS.emerald,
  neutral: COLORS.navy,
};

const AmountDisplay = ({ amount, label, variant = 'neutral' }) => {
  const color = VARIANT_COLORS[variant];

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text style={[styles.amount, { color }]}>{formatKES(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  label: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
    lineHeight: 44,
  },
});

export default AmountDisplay;
