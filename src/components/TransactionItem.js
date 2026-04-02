import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES, formatDate } from '../utils/formatters';

export default function TransactionItem({ item, onLongPress }) {
  const isCredit = item.type === 'credit';
  return (
    <TouchableOpacity
      style={[styles.row, item.is_voided && styles.voided]}
      onLongPress={() => onLongPress && onLongPress(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.icon, { backgroundColor: isCredit ? '#FDECEA' : '#EAF7EE' }]}>
        <Ionicons
          name={isCredit ? 'arrow-up' : 'arrow-down'}
          size={18}
          color={isCredit ? COLORS.danger : COLORS.accent}
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.type, item.is_voided && styles.strike]}>
          {isCredit ? 'Credit Given' : 'Payment Received'}
        </Text>
        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        {item.is_voided ? <Text style={styles.voidedLabel}>VOIDED</Text> : null}
      </View>
      <Text style={[styles.amount, item.is_voided && styles.strike, { color: isCredit ? COLORS.danger : COLORS.accent }]}>
        {isCredit ? '+' : '-'}{formatKES(item.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, elevation: 1 },
  voided: { opacity: 0.45 },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  type: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  desc: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  date: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  amount: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  strike: { textDecorationLine: 'line-through' },
  voidedLabel: { fontSize: FONT_SIZES.xs, color: COLORS.danger, fontWeight: '700', marginTop: 2 },
});
