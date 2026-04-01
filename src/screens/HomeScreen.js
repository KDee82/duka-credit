import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES, getInitials, formatRelativeDate } from '../utils/formatters';
import { getTotalOutstanding, getTodaySummary } from '../db/transactions';
import { getAllCustomers } from '../db/customers';

export default function HomeScreen({ navigation }) {
  const [outstanding, setOutstanding] = useState(0);
  const [summary, setSummary] = useState({ total_credit: 0, total_payment: 0 });
  const [topDebtors, setTopDebtors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    try {
      setOutstanding(getTotalOutstanding());
      setSummary(getTodaySummary());
      const customers = getAllCustomers();
      setTopDebtors(customers.filter((c) => c.balance > 0).slice(0, 5));
    } catch (e) {
      console.error('HomeScreen load error:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={topDebtors}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            {/* Outstanding card */}
            <View style={styles.outstandingCard}>
              <Text style={styles.outstandingLabel}>Total Outstanding</Text>
              <Text style={styles.outstandingAmount}>{formatKES(outstanding)}</Text>
            </View>

            {/* Today summary */}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { borderLeftColor: COLORS.danger }]}>
                <Text style={styles.summaryLabel}>Credit Given Today</Text>
                <Text style={[styles.summaryAmount, { color: COLORS.danger }]}>
                  {formatKES(summary.total_credit)}
                </Text>
              </View>
              <View style={[styles.summaryCard, { borderLeftColor: COLORS.accent }]}>
                <Text style={styles.summaryLabel}>Payments Received</Text>
                <Text style={[styles.summaryAmount, { color: COLORS.accent }]}>
                  {formatKES(summary.total_payment)}
                </Text>
              </View>
            </View>

            {topDebtors.length > 0 && (
              <Text style={styles.sectionTitle}>Top Debtors</Text>
            )}
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.debtorRow}
            onPress={() => navigation.navigate('Customers', {
              screen: 'CustomerDetail',
              params: { customerId: item.id, customerName: item.name },
            })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
            </View>
            <View style={styles.debtorInfo}>
              <Text style={styles.debtorName}>{item.name}</Text>
              <Text style={styles.debtorSub}>
                {item.last_transaction_at ? formatRelativeDate(item.last_transaction_at) : 'No activity'}
              </Text>
            </View>
            <Text style={styles.debtorBalance}>{formatKES(item.balance)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={60} color={COLORS.border} />
            <Text style={styles.emptyText}>No outstanding balances</Text>
            <Text style={styles.emptySubtext}>Add customers and record credit sales to get started</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Customers', { screen: 'AddTransaction', params: {} })}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  outstandingCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  outstandingLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZES.md },
  outstandingAmount: { color: COLORS.white, fontSize: FONT_SIZES.xxxl, fontWeight: 'bold', marginTop: 4 },
  summaryRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12, marginBottom: 8 },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 1,
  },
  summaryLabel: { color: COLORS.textLight, fontSize: FONT_SIZES.xs, marginBottom: 4 },
  summaryAmount: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textLight,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  debtorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZES.md },
  debtorInfo: { flex: 1 },
  debtorName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  debtorSub: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  debtorBalance: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.danger },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textLight, marginTop: 16 },
  emptySubtext: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, textAlign: 'center', marginTop: 8 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
