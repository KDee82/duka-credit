import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Alert, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getCustomerById } from '../db/customers';
import { getTransactionsByCustomer, voidTransaction } from '../db/transactions';
import { formatKES, formatDate, formatTime } from '../utils/formatters';
import { COLORS } from '../theme/colors';
import { shadows } from '../theme/shadows';
import DukaAvatar from '../components/DukaAvatar';
import EmptyState from '../components/EmptyState';

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

  const renderTransaction = ({ item }) => {
    const isCredit = item.type === 'credit';
    return (
      <View style={[styles.txnRow, item.is_voided && styles.txnVoided]}>
        {/* Left color bar */}
        <View style={[styles.txnBar, isCredit ? styles.txnBarCredit : styles.txnBarPayment]} />
        <View style={styles.txnContent}>
          <View style={styles.txnTopRow}>
            <Text style={[styles.txnType, item.is_voided && styles.strikethrough]}>
              {isCredit ? 'Credit Sale' : 'Payment Received'}
            </Text>
            <Text style={[
              styles.txnAmount,
              isCredit ? styles.amountCredit : styles.amountPayment,
              item.is_voided && styles.strikethrough,
            ]}>
              {isCredit ? '+' : '-'}{formatKES(item.amount)}
            </Text>
          </View>
          {item.description ? (
            <Text style={styles.txnDesc}>{item.description}</Text>
          ) : null}
          <View style={styles.txnBottomRow}>
            <Text style={styles.txnDate}>{formatDate(item.created_at)} · {formatTime(item.created_at)}</Text>
            <Text style={styles.txnRunning}>Bal: {formatKES(item.running_balance)}</Text>
          </View>
          {item.is_voided && <Text style={styles.voidedLabel}>VOIDED</Text>}
        </View>
        {!item.is_voided && (
          <Pressable style={styles.voidBtn} onPress={() => handleVoid(item)}>
            <Ionicons name="close-circle-outline" size={20} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>
    );
  };

  if (!customer) return null;

  const isOverLimit = customer.credit_limit > 0 && customer.balance > customer.credit_limit;
  const isSettled = customer.balance <= 0;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.navy} barStyle="light-content" />

      {/* Navy header */}
      <View style={styles.header}>
        <DukaAvatar name={customer.name} size="lg" />
        <View style={styles.headerInfo}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerPhone}>{customer.phone || 'No phone number'}</Text>
        </View>
      </View>

      {/* Balance card */}
      <View style={[styles.balanceCard, isSettled ? styles.balanceCardSettled : styles.balanceCardOwed]}>
        <Text style={styles.balanceCardLabel}>{isSettled ? 'All Settled' : 'Owes You'}</Text>
        <Text style={[styles.balanceCardAmount, isSettled ? styles.amountSettled : styles.amountOwed]}>
          {formatKES(customer.balance)}
        </Text>
      </View>

      {/* Credit limit warning */}
      {isOverLimit && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={16} color={COLORS.gold} />
          <Text style={styles.warningText}>
            Over credit limit of {formatKES(customer.credit_limit)}
          </Text>
        </View>
      )}

      {/* Transaction list */}
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
          <EmptyState
            icon="receipt-outline"
            title="No transactions yet"
            subtitle="Add the first transaction for this customer."
          />
        }
      />

      {/* Gold FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
        onPress={() => navigation.navigate('AddTransaction', {
          customerId: customer.id,
          customerName: customer.name,
        })}
      >
        <Ionicons name="add" size={28} color={COLORS.navy} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  header: {
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },
  headerInfo: { flex: 1 },
  customerName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: COLORS.white,
    marginBottom: 4,
  },
  customerPhone: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
  },

  balanceCard: {
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.md,
  },
  balanceCardOwed: { backgroundColor: COLORS.coralLight },
  balanceCardSettled: { backgroundColor: COLORS.emeraldLight },
  balanceCardLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  balanceCardAmount: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
  },
  amountOwed: { color: COLORS.coral },
  amountSettled: { color: COLORS.emerald },

  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  warningText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: COLORS.gold,
    fontSize: 13,
  },

  list: { padding: 16, paddingBottom: 100 },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },

  txnRow: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    overflow: 'hidden',
    ...shadows.sm,
  },
  txnVoided: { opacity: 0.5 },
  txnBar: { width: 4, alignSelf: 'stretch' },
  txnBarCredit: { backgroundColor: COLORS.coral },
  txnBarPayment: { backgroundColor: COLORS.emerald },
  txnContent: { flex: 1, padding: 12 },
  txnTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txnType: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  txnAmount: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
  },
  amountCredit: { color: COLORS.coral },
  amountPayment: { color: COLORS.emerald },
  txnDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  txnBottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  txnDate: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  txnRunning: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  strikethrough: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  voidedLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: COLORS.coral,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  voidBtn: { padding: 10 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.gold,
  },
});

export default CustomerDetailScreen;
