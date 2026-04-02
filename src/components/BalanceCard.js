import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES } from '../utils/formatters';

export default function BalanceCard({ label, amount, color = COLORS.primary, subtitle }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color }]}>{formatKES(amount)}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 1,
  },
  label: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginBottom: 4 },
  amount: { fontSize: FONT_SIZES.xl, fontWeight: '700' },
  subtitle: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 4 },
});
