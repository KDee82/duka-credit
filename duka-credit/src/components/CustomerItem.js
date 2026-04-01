import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatKES, getInitials } from '../utils/formatters';
import { COLORS } from '../utils/constants';

const CustomerItem = ({ customer, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={[styles.avatar, customer.balance > 0 && styles.avatarActive]}>
      <Text style={[styles.avatarText, customer.balance > 0 && styles.avatarTextActive]}>
        {getInitials(customer.name)}
      </Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{customer.name}</Text>
      <Text style={styles.phone}>{customer.phone || 'No phone'}</Text>
    </View>
    <Text style={[styles.balance, customer.balance > 0 ? styles.balanceOwed : styles.balanceClear]}>
      {formatKES(customer.balance)}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    backgroundColor: COLORS.surface, borderRadius: 10, marginBottom: 8,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarActive: { backgroundColor: COLORS.primaryLight },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: COLORS.textSecondary },
  avatarTextActive: { color: COLORS.primary },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  phone: { fontSize: 13, color: COLORS.textSecondary },
  balance: { fontSize: 15, fontWeight: 'bold' },
  balanceOwed: { color: COLORS.danger },
  balanceClear: { color: COLORS.accent },
});

export default CustomerItem;
