import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  Pressable, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllCustomers, searchCustomers } from '../db/customers';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { formatKESShort } from '../utils/formatters';
import DukaAvatar from '../components/DukaAvatar';
import EmptyState from '../components/EmptyState';

export default function CustomerListScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      setCustomers(getAllCustomers());
    }, [])
  );

  const filtered = query.trim()
    ? searchCustomers(query)
    : customers;

  const renderCustomer = ({ item }) => {
    const isSettled = item.balance <= 0;
    return (
      <Pressable
        style={styles.customerRow}
        onPress={() => navigation.navigate('CustomerDetail', {
          customerId: item.id,
          customerName: item.name,
        })}
        android_ripple={{ color: 'rgba(15,31,61,0.05)' }}
      >
        <DukaAvatar name={item.name} size="md" />
        <View style={styles.customerInfo}>
          <Text style={[styles.customerName, typography.headingSmall]}>{item.name}</Text>
          <Text style={[styles.customerPhone, typography.bodySmall]}>{item.phone || 'No phone'}</Text>
        </View>
        {isSettled ? (
          <View style={styles.settledBadge}>
            <Text style={[styles.settledText, typography.labelSmall]}>SETTLED</Text>
          </View>
        ) : (
          <View style={styles.amountBadge}>
            <Text style={[styles.amountText, typography.labelMedium]}>{formatKESShort(item.balance)}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, typography.headingLarge]}>Customers</Text>
        <Text style={[styles.headerCount, typography.bodySmall]}>{customers.length} total</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, typography.bodyMedium]}
          placeholder="Search by name or phone…"
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCustomer}
        contentContainerStyle={[styles.listContent, filtered.length === 0 && { flex: 1 }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title={query ? 'No results found' : 'No customers yet'}
            subtitle={query ? 'Try a different name or phone number' : 'Tap "Add Customer" to get started'}
          />
        }
      />

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddCustomer')}
        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      >
        <Ionicons name="add" size={22} color={COLORS.navy} />
        <Text style={[styles.fabText, typography.labelLarge]}>Add Customer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { color: COLORS.white },
  headerCount: { color: COLORS.textMuted, marginTop: 2 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: spacing.lg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    paddingVertical: spacing.xs,
  },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  separator: { height: spacing.sm },
  customerInfo: { flex: 1, marginLeft: spacing.md },
  customerName: { color: COLORS.textPrimary },
  customerPhone: { color: COLORS.textSecondary, marginTop: 2 },
  amountBadge: {
    backgroundColor: COLORS.coralLight,
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
  },
  amountText: { color: COLORS.coral },
  settledBadge: {
    backgroundColor: COLORS.emeraldLight,
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
  },
  settledText: { color: COLORS.emerald },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    borderRadius: radius.full,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    gap: 8,
    ...shadows.lg,
  },
  fabText: { color: COLORS.white },
});
