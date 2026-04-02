import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  RefreshControl, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTotalOutstanding, getTodaySummary, getTopDebtors } from '../db/transactions';
import { formatKES, formatKESShort } from '../utils/formatters';
import { COLORS } from '../theme/colors';
import { shadows } from '../theme/shadows';
import DukaAvatar from '../components/DukaAvatar';
import EmptyState from '../components/EmptyState';

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
      <StatusBar backgroundColor={COLORS.navy} barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.gold]} />}
      >
        {/* Hero outstanding card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total Outstanding</Text>
          <Text style={styles.heroAmount}>{formatKES(outstanding)}</Text>
          <Text style={styles.heroSubtext}>owed to you across all customers</Text>
        </View>

        {/* Today's stat cards */}
        <View style={styles.statRow}>
          <View style={[styles.statCard, styles.statCardCredit]}>
            <View style={styles.statIconWrap}>
              <Ionicons name="arrow-up-circle" size={22} color={COLORS.coral} />
            </View>
            <Text style={styles.statLabel}>Credit Given</Text>
            <Text style={[styles.statAmount, { color: COLORS.coral }]}>
              {formatKESShort(summary.total_credit)}
            </Text>
          </View>
          <View style={[styles.statCard, styles.statCardPayment]}>
            <View style={styles.statIconWrap}>
              <Ionicons name="arrow-down-circle" size={22} color={COLORS.emerald} />
            </View>
            <Text style={styles.statLabel}>Payments In</Text>
            <Text style={[styles.statAmount, { color: COLORS.emerald }]}>
              {formatKESShort(summary.total_payments)}
            </Text>
          </View>
        </View>

        {/* Top Debtors section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Top Debtors</Text>
            <View style={styles.goldUnderline} />
          </View>
          <Pressable onPress={() => navigation.navigate('Customers')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {topDebtors.length === 0 ? (
          <EmptyState
            icon="checkmark-circle-outline"
            title="All settled up!"
            subtitle="No outstanding balances right now."
          />
        ) : (
          topDebtors.map((customer) => (
            <Pressable
              key={customer.id}
              style={({ pressed }) => [styles.debtorRow, pressed && styles.rowPressed]}
              android_ripple={{ color: COLORS.border }}
              onPress={() => navigation.navigate('CustomerDetail', {
                customerId: customer.id,
                customerName: customer.name,
              })}
            >
              <DukaAvatar name={customer.name} size="md" />
              <View style={styles.debtorInfo}>
                <Text style={styles.debtorName}>{customer.name}</Text>
                <Text style={styles.debtorPhone}>{customer.phone || 'No phone'}</Text>
              </View>
              <Text style={styles.debtorBalance}>{formatKES(customer.balance)}</Text>
            </Pressable>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Gold FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={32} color={COLORS.navy} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { padding: 16 },

  heroCard: {
    backgroundColor: COLORS.navy,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    ...shadows.lg,
  },
  heroLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  heroAmount: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: COLORS.coral,
    fontSize: 42,
    lineHeight: 50,
    marginBottom: 6,
  },
  heroSubtext: {
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },

  statRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    ...shadows.sm,
  },
  statCardCredit: { borderTopWidth: 3, borderTopColor: COLORS.coralLight },
  statCardPayment: { borderTopWidth: 3, borderTopColor: COLORS.emeraldLight },
  statIconWrap: { marginBottom: 6 },
  statLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 4,
  },
  statAmount: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  goldUnderline: {
    height: 3,
    width: 40,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  seeAll: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: COLORS.gold,
    fontSize: 14,
    marginTop: 2,
  },

  debtorRow: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    ...shadows.sm,
  },
  rowPressed: { opacity: 0.85 },
  debtorInfo: { flex: 1, marginLeft: 12 },
  debtorName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  debtorPhone: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  debtorBalance: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: COLORS.coral,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.gold,
  },
});

export default HomeScreen;
