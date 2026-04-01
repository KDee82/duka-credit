import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getCustomerById } from '../db/customers';
import { getTransactionsByCustomer, voidTransaction } from '../db/transactions';
import { formatKES, formatDate, formatTime, getInitials } from '../utils/formatters';
import { COLORS } from '../utils/constants';

const CustomerDetailScreen = ({ route, navigation }) => {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const loadData = useCallback(() => {
    try {
      const cust = getCustomerById(customerId);
      const txns = getTransactionsByCustomer(customerId);
      setCustomer(cust);
      setTransactions(txns);
    } catch (e) {
      console.error('CustomerDetail load error:', e);
    }
  }, [customerId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleVoid = (txn) => {
    Alert.alert(
      'Void Transaction',
      `Are you sure you want to void this ${txn.type} of ${formatKES(txn.amount)}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Void', style: 'destructive',
          onPress: () => {
            voidTransaction(txn.id);
            loadData();
          },
        },
      ]
    );
  };

  const renderTransaction = ({ item }) => (
    <View style={[styles.txnRow, item.is_voided && styles.txnVoided]}>
      <View style={[styles.txnBadge, item.type === 'credit' ? styles.creditBadge : styles.paymentBadge]}>
        <Ionicons
          name={item.type === 'credit' ? 'arrow-up' : 'arrow-down'}
          size={16}
          color={item.type === 'credit' ? COLORS.danger : COLORS.accent}
        />
      </View>
      <View style={styles.txnInfo}>
        <View style={styles.txnTopRow}>
          <Text style={[styles.txnType, item.is_voided && styles.voided]}>
            {item.type === 'credit' ? 'Credit Sale' : 'Payment Received'}
          </Text>
          <Text style={[
            styles.txnAmount,
            item.type === 'credit' ? styles.amountCredit : styles.amountPayment,
            item.is_voided && styles.voided,
          ]}>
            {item.type === 'credit' ? '+' : '-'}{formatKES(item.amount)}
          </Text>
        </View>
        {item.description ? (
          <Text style={styles.txnDesc}>{item.description}</Text>
        ) : null}
        <View style={styles.txnBottomRow}>
          <Text style={styles.txnDate}>{formatDate(item.created_at)} • {formatTime(item.created_at)}</Text>
          <Text style={styles.txnRunning}>Bal: {formatKES(item.running_balance)}</Text>
        </View>
        {item.is_voided && <Text style={styles.voidedLabel}>VOIDED</Text>}
      </View>
      {!item.is_voided && (
        <TouchableOpacity style={styles.voidBtn} onPress={() => handleVoid(item)}>
          <Ionicons name="close-circle-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (!customer) return null;

  const isOverLimit = customer.credit_limit > 0 && customer.balance > customer.credit_limit;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Customer header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{getInitials(customer.name)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerPhone}>{customer.phone || 'No phone number'}</Text>
        </View>
        <View style={styles.balanceBlock}>
          <Text style={[styles.balanceAmount, customer.balance > 0 ? styles.balanceOwed : styles.balanceClear]}>
            {formatKES(customer.balance)}
          </Text>
          <Text style={styles.balanceLabel}>
            {customer.balance > 0 ? 'owes you' : 'settled'}
          </Text>
        </View>
      </View>

      {/* Credit limit warning */}
      {isOverLimit && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={16} color={COLORS.warning} />
          <Text style={styles.warningText}>
            Over credit limit of {formatKES(customer.credit_limit)}
          </Text>
        </View>
      )}

      {/* Transactions */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            Transaction History ({transactions.filter(t => !t.is_voided).length})
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
      />

      {/* Add Transaction FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction', { customerId: customer.id, customerName: customer.name })}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  avatarLarge: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerInfo: { flex: 1 },
  customerName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  customerPhone: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  balanceBlock: { alignItems: 'flex-end' },
  balanceAmount: { fontSize: 20, fontWeight: 'bold' },
  balanceOwed: { color: COLORS.danger },
  balanceClear: { color: COLORS.accent },
  balanceLabel: { fontSize: 11, color: COLORS.textSecondary },

  warningBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warningLight,
    paddingHorizontal: 16, paddingVertical: 8, gap: 6,
  },
  warningText: { color: COLORS.warning, fontSize: 13, fontWeight: '600' },

  list: { padding: 12, paddingBottom: 90 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },

  txnRow: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2,
  },
  txnVoided: { opacity: 0.5 },
  txnBadge: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 2,
  },
  creditBadge: { backgroundColor: COLORS.dangerLight },
  paymentBadge: { backgroundColor: COLORS.accentLight },
  txnInfo: { flex: 1 },
  txnTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txnType: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  txnAmount: { fontSize: 15, fontWeight: 'bold' },
  amountCredit: { color: COLORS.danger },
  amountPayment: { color: COLORS.accent },
  txnDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 3 },
  txnBottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  txnDate: { fontSize: 11, color: COLORS.textMuted },
  txnRunning: { fontSize: 11, color: COLORS.textMuted },
  voided: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  voidedLabel: { fontSize: 10, color: COLORS.danger, fontWeight: '700', marginTop: 2 },
  voidBtn: { padding: 4, marginLeft: 6 },

  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary, marginTop: 8 },

  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8,
  },
});

export default CustomerDetailScreen;
