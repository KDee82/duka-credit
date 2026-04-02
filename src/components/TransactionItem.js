import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES, formatDate } from '../utils/formatters';

export default function TransactionItem({ transaction }) {
  const isCredit = transaction.type === 'credit';
  const isVoided = transaction.is_voided === 1;

  return (
    <View style={[styles.row, isVoided && styles.voided]}>
      <View style={[styles.badge, isCredit ? styles.creditBadge : styles.paymentBadge]}>
        <Text style={[styles.badgeText, { color: isCredit ? COLORS.danger : COLORS.accent }]}>
          {isCredit ? 'CR' : 'PMT'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.desc} numberOfLines={1}>
          {transaction.description || (isCredit ? 'Credit sale' : 'Payment')}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.created_at)}</Text>
      </View>
      <Text style={[styles.amount, { color: isCredit ? COLORS.danger : COLORS.accent }]}>
        {isCredit ? '+' : '-'}{formatKES(transaction.amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  voided: { opacity: 0.4 },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  creditBadge: { backgroundColor: '#FDECEA' },
  paymentBadge: { backgroundColor: '#EAF7EE' },
  badgeText: { fontSize: FONT_SIZES.xs, fontWeight: '800' },
  info: { flex: 1 },
  desc: { fontSize: FONT_SIZES.sm, color: COLORS.text, fontWeight: '500' },
  date: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  amount: { fontSize: FONT_SIZES.md, fontWeight: '700' },
});
