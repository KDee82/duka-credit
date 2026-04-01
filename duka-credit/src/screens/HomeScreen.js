import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTotalOutstanding, getTodaySummary, getTopDebtors } from '../db/transactions';
import { formatKES, formatKESShort, getInitials } from '../utils/formatters';
import { COLORS } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
  const [outstanding, setOutstanding] = useState(0);
  const [summary, setSummary] = useState({ total_credit: 0, total_payments: 0 });
  const [topDebtors, setTopDebtors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    try {
      setOutstanding(getTotalOutstanding());
      setSummary(getTodaySummary());
      setTopDebtors(getTopDebtors(5));
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
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {/* Total Outstanding Card */}
        <View style={styles.outstandingCard}>
          <Text style={styles.outstandingLabel}>Total Outstanding</Text>
          <Text style={styles.outstandingAmount}>{formatKES(outstanding)}</Text>
          <Text style={styles.outstandingSubtext}>owed to you across all customers</Text>
        </View>

        {/* Today's Summary */}
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.creditCard]}>
            <Ionicons name="arrow-up-circle" size={28} color={COLORS.danger} />
            <Text style={styles.summaryLabel}>Credit Given</Text>
            <Text style={[styles.summaryAmount, { color: COLORS.danger }]}>
              {formatKESShort(summary.total_credit)}
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.paymentCard]}>
            <Ionicons name="arrow-down-circle" size={28} color={COLORS.accent} />
            <Text style={styles.summaryLabel}>Payments In</Text>
            <Text style={[styles.summaryAmount, { color: COLORS.accent }]}>
              {formatKESShort(summary.total_payments)}
            </Text>
          </View>
        </View>

        {/* Top Debtors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Debtors</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Customers')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {topDebtors.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={48} color={COLORS.accent} />
            <Text style={styles.emptyText}>No outstanding balances!</Text>
            <Text style={styles.emptySubtext}>All customers are settled up.</Text>
          </View>
        ) : (
          topDebtors.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              style={styles.debtorRow}
              onPress={() => navigation.navigate('CustomerDetail', {
                customerId: customer.id,
                customerName: customer.name,
              })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(customer.name)}</Text>
              </View>
              <View style={styles.debtorInfo}>
                <Text style={styles.debtorName}>{customer.name}</Text>
                <Text style={styles.debtorPhone}>{customer.phone || 'No phone'}</Text>
              </View>
              <Text style={styles.debtorBalance}>{formatKES(customer.balance)}</Text>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16 },

  outstandingCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  outstandingLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  outstandingAmount: { color: '#FFF', fontSize: 42, fontWeight: 'bold', marginVertical: 6 },
  outstandingSubtext: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },

  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16,
    alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 12, marginTop: 6, fontWeight: '500' },
  summaryAmount: { fontSize: 22, fontWeight: 'bold', marginTop: 2 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  seeAll: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },

  debtorRow: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  debtorInfo: { flex: 1 },
  debtorName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  debtorPhone: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  debtorBalance: { fontSize: 16, fontWeight: 'bold', color: COLORS.danger },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12 },
  emptySubtext: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },

  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8,
  },
});

export default HomeScreen;
