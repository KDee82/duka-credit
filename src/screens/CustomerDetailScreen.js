import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES, formatDate } from '../utils/formatters';
import { getCustomerById } from '../db/customers';
import { getTransactionsByCustomer, voidTransaction } from '../db/transactions';

export default function CustomerDetailScreen({ route, navigation }) {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    try {
      const c = getCustomerById(customerId);
      setCustomer(c);
      setTransactions(getTransactionsByCustomer(customerId));
      if (c) navigation.setOptions({ title: c.name });
    } catch (e) {
      console.error('CustomerDetail load error:', e);
    }
  }, [customerId, navigation]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = () => { setRefreshing(true); load(); setRefreshing(false); };

  const handleVoid = (txn) => {
    if (txn.is_voided) return;
    Alert.alert(
      'Void Transaction',
      `Void this ${txn.type} of ${formatKES(txn.amount)}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Void', style: 'destructive', onPress: () => { voidTransaction(txn.id); load(); } },
      ]
    );
  };

  if (!customer) return null;

  const balance = customer.balance || 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: balance > 0 ? COLORS.primary : COLORS.accent }]}>
        <Text style={styles.headerLabel}>Current Balance</Text>
        <Text style={styles.headerBalance}>{formatKES(balance)}</Text>
        {customer.phone ? <Text style={styles.headerPhone}>{customer.phone}</Text> : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: COLORS.danger }]}
          onPress={() => navigation.navigate('AddTransaction', { customerId, customerName: customer.name, defaultType: 'credit' })}
        >
          <Ionicons name="arrow-up-circle" size={20} color={COLORS.white} />
          <Text style={styles.actionBtnText}>Credit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: COLORS.accent }]}
          onPress={() => navigation.navigate('AddTransaction', { customerId, customerName: customer.name, defaultType: 'payment' })}
        >
          <Ionicons name="arrow-down-circle" size={20} color={COLORS.white} />
          <Text style={styles.actionBtnText}>Payment</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.historyLabel}>Transaction History</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.txnRow, item.is_voided && styles.txnVoided]}
            onLongPress={() => handleVoid(item)}
            activeOpacity={0.8}
          >
            <View style={[styles.txnIcon, { backgroundColor: item.type === 'credit' ? '#FDECEA' : '#EAF7EE' }]}>
              <Ionicons
                name={item.type === 'credit' ? 'arrow-up' : 'arrow-down'}
                size={18}
                color={item.type === 'credit' ? COLORS.danger : COLORS.accent}
              />
            </View>
            <View style={styles.txnInfo}>
              <Text style={[styles.txnType, item.is_voided && styles.strikethrough]}>
                {item.type === 'credit' ? 'Credit Given' : 'Payment Received'}
              </Text>
              {item.description ? <Text style={styles.txnDesc}>{item.description}</Text> : null}
              <Text style={styles.txnDate}>{formatDate(item.created_at)}</Text>
              {item.is_voided ? <Text style={styles.voidedBadge}>VOIDED</Text> : null}
            </View>
            <Text style={[styles.txnAmount, item.is_voided && styles.strikethrough, { color: item.type === 'credit' ? COLORS.danger : COLORS.accent }]}>
              {item.type === 'credit' ? '+' : '-'}{formatKES(item.amount)}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={50} color={COLORS.border} />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 24, alignItems: 'center' },
  headerLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZES.sm },
  headerBalance: { color: COLORS.white, fontSize: FONT_SIZES.xxxl, fontWeight: 'bold', marginTop: 4 },
  headerPhone: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZES.sm, marginTop: 6 },
  actions: { flexDirection: 'row', margin: 16, gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
  actionBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZES.md },
  historyLabel: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textLight, marginHorizontal: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  txnRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, elevation: 1 },
  txnVoided: { opacity: 0.5 },
  txnIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txnInfo: { flex: 1 },
  txnType: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  txnDesc: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  txnDate: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  txnAmount: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  strikethrough: { textDecorationLine: 'line-through' },
  voidedBadge: { fontSize: FONT_SIZES.xs, color: COLORS.danger, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textLight, marginTop: 12 },
});
