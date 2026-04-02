import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES, getInitials, formatRelativeDate } from '../utils/formatters';

export default function CustomerItem({ customer, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={[styles.avatar, customer.balance > 0 && { backgroundColor: COLORS.danger }]}>
        <Text style={styles.avatarText}>{getInitials(customer.name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{customer.name}</Text>
        <Text style={styles.sub}>{customer.phone || 'No phone'}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.balance, customer.balance > 0 && { color: COLORS.danger }]}>
          {formatKES(customer.balance)}
        </Text>
        {customer.last_transaction_at ? (
          <Text style={styles.lastActivity}>{formatRelativeDate(customer.last_transaction_at)}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZES.md },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  sub: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  balance: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text },
  lastActivity: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
});
