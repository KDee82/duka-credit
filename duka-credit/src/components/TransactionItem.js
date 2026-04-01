import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatKES, formatDate } from '../utils/formatters';
import { COLORS } from '../utils/constants';

const TransactionItem = ({ transaction }) => {
  const isCredit = transaction.type === 'credit';
  return (
    <View style={[styles.row, transaction.is_voided && styles.voided]}>
      <View style={[styles.icon, isCredit ? styles.iconCredit : styles.iconPayment]}>
        <Ionicons
          name={isCredit ? 'arrow-up' : 'arrow-down'}
          size={16}
          color={isCredit ? COLORS.danger : COLORS.accent}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.type}>{isCredit ? 'Credit' : 'Payment'}</Text>
        {transaction.description ? <Text style={styles.desc}>{transaction.description}</Text> : null}
        <Text style={styles.date}>{formatDate(transaction.created_at)}</Text>
      </View>
      <Text style={[styles.amount, isCredit ? styles.amountCredit : styles.amountPayment]}>
        {isCredit ? '+' : '-'}{formatKES(transaction.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.background,
  },
  voided: { opacity: 0.4 },
  icon: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  iconCredit: { backgroundColor: COLORS.dangerLight },
  iconPayment: { backgroundColor: COLORS.accentLight },
  info: { flex: 1 },
  type: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  desc: { fontSize: 12, color: COLORS.textSecondary },
  date: { fontSize: 11, color: COLORS.textMuted },
  amount: { fontSize: 15, fontWeight: 'bold' },
  amountCredit: { color: COLORS.danger },
  amountPayment: { color: COLORS.accent },
});

export default TransactionItem;
