import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatKES } from '../utils/formatters';
import { COLORS } from '../utils/constants';

const BalanceCard = ({ label, amount, color, icon }) => (
  <View style={[styles.card, { borderLeftColor: color || COLORS.primary }]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.amount, { color: color || COLORS.primary }]}>{formatKES(amount)}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 14,
    borderLeftWidth: 4, flex: 1,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 3,
  },
  label: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500', marginBottom: 4 },
  amount: { fontSize: 18, fontWeight: 'bold' },
});

export default BalanceCard;
