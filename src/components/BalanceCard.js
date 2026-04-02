import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES } from '../utils/formatters';

export default function BalanceCard({ label, amount, color, subtitle }) {
  return (
    <View style={[styles.card, { borderLeftColor: color || COLORS.primary }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color: color || COLORS.primary }]}>{formatKES(amount)}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  amount: { fontSize: FONT_SIZES.xl, fontWeight: '800' },
  subtitle: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 4 },
});
