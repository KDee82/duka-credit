import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable,
  Alert, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getCustomerById } from '../db/customers';
import { getTransactionsByCustomer, voidTransaction } from '../db/transactions';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { formatKES, formatDate, formatRelativeDate } from '../utils/formatters';
import DukaAvatar from '../components/DukaAvatar';
import EmptyState from '../components/EmptyState';

export default function CustomerDetailScreen({ route, navigation }) {
  const { customerId, customerName } = route.params;
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const c = getCustomerById(customerId);
      setCustomer(c);
      setTransactions(getTransactionsByCustomer(customerId));
    }, [customerId])
  );

  const handleVoid = (txId) => {
    Alert.alert('Void Transaction', 'Are you sure you want to void this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Void',
        style: 'destructive',
        onPress: () => {
          voidTransaction(txId);
          setTransactions(getTransactionsByCustomer(customerId));
          const c = getCustomerById(customerId);
          setCustomer(c);
        },
      },
    ]);
  };

  const balance = customer?.balance ?? 0;
  const isSettled = balance <= 0;

  const renderTransaction = ({ item }) => {
    const isCredit = item.type === 'credit';
    return (
      <Pressable
        style={[styles.txRow, item.is_voided && styles.txVoided]}
        onLongPress={() => !item.is_voided && handleVoid(item.id)}
        android_ripple={{ color: 'rgba(15,31,61,0.05)' }}
      >
        <View style={[styles.txAccent, { backgroundColor: isCredit ? COLORS.coral : COLORS.emerald }]} />
        <View style={styles.txBody}>
          <View style={styles.txTop}>
            <Text style={[styles.txDesc, typography.headingSmall, item.is_voided && styles.txVoidedText]}>
              {item.description || (isCredit ? 'Credit' : 'Payment')}
            </Text>
            <Text style={[
              styles.txAmount,
              typography.amountMedium,
              { color: isCredit ? COLORS.coral : COLORS.emerald },
              item.is_voided && styles.txVoidedText,
            ]}>
              {isCredit ? '+' : '-'}{formatKES(item.amount)}
            </Text>
          </View>
          <View style={styles.txBottom}>
            <Text style={[styles.txDate, typography.bodySmall]}>{formatRelativeDate(item.created_at)}</Text>
            {item.is_voided && (
              <View style={styles.voidedBadge}>
                <Text style={[styles.voidedText, typography.labelSmall]}>VOIDED</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Navy header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </Pressable>
        <View style={styles.headerContent}>
          <DukaAvatar name={customerName} size="lg" />
          <Text style={[styles.customerName, typography.headingLarge]}>{customerName}</Text>
          {customer?.phone ? (
            <Text style={[styles.customerPhone, typography.bodyMedium]}>{customer.phone}</Text>
          ) : null}
        </View>
      </View>

      {/* Balance card */}
      <View style={styles.balanceCard}>
        <Text style={[styles.balanceLabel, typography.labelMedium]}>CURRENT BALANCE</Text>
        <Text style={[styles.balanceAmount, typography.amountHero, { color: isSettled ? COLORS.emerald : COLORS.coral }]}>
          {formatKES(Math.abs(balance))}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: isSettled ? COLORS.emeraldLight : COLORS.coralLight }]}>
          <Text style={[styles.statusText, typography.labelSmall, { color: isSettled ? COLORS.emerald : COLORS.coral }]}>
            {isSettled ? '✓ SETTLED' : 'OWES'}
          </Text>
        </View>
      </View>

      {/* Transaction list */}
      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, typography.headingMedium]}>Transactions</Text>
        <View style={styles.listAccent} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTransaction}
        contentContainerStyle={[styles.listContent, transactions.length === 0 && { flex: 1 }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No transactions yet"
            subtitle="Tap the button below to record a credit or payment"
          />
        }
      />

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction', { customerId, customerName })}
        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      >
        <Ionicons name="add" size={22} color={COLORS.navy} />
        <Text style={[styles.fabText, typography.labelLarge]}>Add Transaction</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
  },
  backBtn: { marginBottom: spacing.md },
  headerContent: { alignItems: 'center' },
  customerName: { color: COLORS.white, marginTop: spacing.md },
  customerPhone: { color: COLORS.textMuted, marginTop: 4 },
  balanceCard: {
    backgroundColor: COLORS.surface,
    margin: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadows.md,
  },
  balanceLabel: {
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  balanceAmount: { marginBottom: spacing.md },
  statusBadge: {
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.lg,
  },
  statusText: { letterSpacing: 0.5 },
  listHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  listTitle: { color: COLORS.textPrimary, marginBottom: 4 },
  listAccent: { width: 36, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  txRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  txVoided: { opacity: 0.5 },
  txAccent: { width: 4 },
  txBody: { flex: 1, padding: spacing.md },
  txTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  txDesc: { flex: 1, color: COLORS.textPrimary, marginRight: spacing.sm },
  txAmount: {},
  txVoidedText: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  txBottom: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  txDate: { color: COLORS.textSecondary, flex: 1 },
  voidedBadge: {
    backgroundColor: COLORS.border,
    borderRadius: radius.sm,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  voidedText: { color: COLORS.textMuted },
  separator: { height: spacing.sm },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: radius.full,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    gap: 8,
    ...shadows.gold,
  },
  fabText: { color: COLORS.navy },
});
