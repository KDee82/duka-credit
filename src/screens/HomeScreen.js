import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  Pressable, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTotalOutstanding, getTodaySummary, getTopDebtors } from '../db/transactions';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { formatKES, formatKESShort } from '../utils/formatters';
import DukaAvatar from '../components/DukaAvatar';
import EmptyState from '../components/EmptyState';

export default function HomeScreen({ navigation }) {
  const [outstanding, setOutstanding] = useState(0);
  const [todaySummary, setTodaySummary] = useState({ credits: 0, payments: 0 });
  const [topDebtors, setTopDebtors] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setOutstanding(getTotalOutstanding());
      setTodaySummary(getTodaySummary());
      setTopDebtors(getTopDebtors(5));
    }, [])
  );

  const renderDebtor = ({ item }) => (
    <Pressable
      style={styles.debtorRow}
      onPress={() => navigation.navigate('Home', {
        screen: 'CustomerDetail',
        params: { customerId: item.id, customerName: item.name },
      })}
      android_ripple={{ color: 'rgba(15,31,61,0.05)' }}
    >
      <DukaAvatar name={item.name} size="md" />
      <View style={styles.debtorInfo}>
        <Text style={[styles.debtorName, typography.headingSmall]}>{item.name}</Text>
        <Text style={[styles.debtorPhone, typography.bodySmall]}>{item.phone || 'No phone'}</Text>
      </View>
      <View style={styles.debtorAmountWrap}>
        <Text style={[styles.debtorAmount, typography.amountMedium]}>{formatKESShort(item.balance)}</Text>
        <Text style={[styles.owedLabel, typography.labelSmall]}>OWED</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerGreet, typography.bodyMedium]}>Good day 👋</Text>
          <Text style={[styles.headerTitle, typography.headingLarge]}>Duka Credit</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="storefront" size={26} color={COLORS.gold} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={styles.heroCard}>
          <Text style={[styles.heroLabel, typography.labelMedium]}>TOTAL OUTSTANDING</Text>
          <Text style={[styles.heroAmount, typography.amountHero]}>{formatKES(outstanding)}</Text>
          <Text style={[styles.heroSub, typography.bodySmall]}>across all customers</Text>
        </View>

        {/* Stat row */}
        <View style={styles.statRow}>
          <View style={[styles.statCard, styles.statCardCredit]}>
            <Ionicons name="arrow-up-circle" size={22} color={COLORS.coral} />
            <Text style={[styles.statLabel, typography.labelSmall]}>TODAY'S CREDIT</Text>
            <Text style={[styles.statAmount, typography.amountMedium, { color: COLORS.coral }]}>
              {formatKESShort(todaySummary.credits)}
            </Text>
          </View>
          <View style={[styles.statCard, styles.statCardPayment]}>
            <Ionicons name="arrow-down-circle" size={22} color={COLORS.emerald} />
            <Text style={[styles.statLabel, typography.labelSmall]}>TODAY'S PAYMENTS</Text>
            <Text style={[styles.statAmount, typography.amountMedium, { color: COLORS.emerald }]}>
              {formatKESShort(todaySummary.payments)}
            </Text>
          </View>
        </View>

        {/* Top debtors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, typography.headingMedium]}>Top Debtors</Text>
            <View style={styles.sectionAccent} />
          </View>

          {topDebtors.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="No debtors yet"
              subtitle="Add customers and record credit transactions"
            />
          ) : (
            <View style={styles.debtorList}>
              {topDebtors.map((item) => (
                <View key={item.id}>{renderDebtor({ item })}</View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('Home', { screen: 'AddTransaction' })}
        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      >
        <Ionicons name="add" size={28} color={COLORS.navy} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: spacing.lg,
  },
  headerGreet: { color: COLORS.textMuted },
  headerTitle: { color: COLORS.white },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(232,160,32,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },
  heroCard: {
    backgroundColor: COLORS.navy,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  heroLabel: { color: COLORS.textMuted, letterSpacing: 1.2, marginBottom: spacing.sm },
  heroAmount: { color: COLORS.coral, marginBottom: spacing.xs },
  heroSub: { color: COLORS.textSecondary },
  statRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  statCardCredit: { borderLeftWidth: 3, borderLeftColor: COLORS.coral },
  statCardPayment: { borderLeftWidth: 3, borderLeftColor: COLORS.emerald },
  statLabel: { color: COLORS.textSecondary, letterSpacing: 0.5, marginVertical: spacing.xs },
  statAmount: {},
  section: { marginBottom: spacing.xxl },
  sectionHeader: { marginBottom: spacing.md },
  sectionTitle: { color: COLORS.textPrimary, marginBottom: 4 },
  sectionAccent: { width: 36, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  debtorList: {
    backgroundColor: COLORS.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  debtorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  debtorInfo: { flex: 1, marginLeft: spacing.md },
  debtorName: { color: COLORS.textPrimary },
  debtorPhone: { color: COLORS.textSecondary, marginTop: 2 },
  debtorAmountWrap: { alignItems: 'flex-end' },
  debtorAmount: { color: COLORS.coral },
  owedLabel: { color: COLORS.textMuted, letterSpacing: 0.5, marginTop: 2 },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.gold,
  },
});
