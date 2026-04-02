import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES, getInitials, formatRelativeDate } from '../utils/formatters';

export default function CustomerItem({ customer, onPress }) {
  const hasBalance = customer.balance > 0;
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress && onPress(customer)}>
      <View style={[styles.avatar, hasBalance && { backgroundColor: COLORS.danger }]}>
        <Text style={styles.initials}>{getInitials(customer.name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{customer.name}</Text>
        <Text style={styles.sub}>
          {customer.phone || 'No phone'} ·{' '}
          {customer.last_transaction_at ? formatRelativeDate(customer.last_transaction_at) : 'No activity'}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.balance, hasBalance && { color: COLORS.danger }]}>
          {formatKES(customer.balance)}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: 12, marginBottom: 8, borderRadius: 12, padding: 14, elevation: 1 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  initials: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZES.md },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  sub: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  balance: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text },
});
