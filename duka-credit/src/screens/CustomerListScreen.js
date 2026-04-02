import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllCustomers, searchCustomers } from '../db/customers';
import { formatKES, formatRelativeDate } from '../utils/formatters';
import { COLORS } from '../theme/colors';
import { shadows } from '../theme/shadows';
import DukaAvatar from '../components/DukaAvatar';
import EmptyState from '../components/EmptyState';

const CustomerListScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');

  const loadCustomers = useCallback((searchQuery = '') => {
    try {
      const data = searchQuery.trim()
        ? searchCustomers(searchQuery)
        : getAllCustomers();
      setCustomers(data);
    } catch (e) {
      console.error('CustomerList load error:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCustomers(query);
    }, [query, loadCustomers])
  );

  const handleSearch = (text) => {
    setQuery(text);
    loadCustomers(text);
  };

  const renderCustomer = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.customerRow, pressed && { opacity: 0.85 }]}
      android_ripple={{ color: COLORS.border }}
      onPress={() => navigation.navigate('CustomerDetail', {
        customerId: item.id,
        customerName: item.name,
      })}
    >
      <DukaAvatar name={item.name} size="md" />
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone || 'No phone'}</Text>
        <Text style={styles.lastActivity}>
          {item.last_activity ? `Last: ${formatRelativeDate(item.last_activity)}` : 'No transactions yet'}
        </Text>
      </View>
      <View style={styles.balanceContainer}>
        {item.balance > 0 ? (
          <>
            <View style={styles.owedPill}>
              <Text style={styles.owedPillText}>{formatKES(item.balance)}</Text>
            </View>
            <Text style={styles.owesLabel}>owes</Text>
          </>
        ) : (
          <View style={styles.settledBadge}>
            <Text style={styles.settledText}>Settled</Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.navy} barStyle="light-content" />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.navy} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <Pressable onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCustomer}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title={query ? 'No customers found' : 'No customers yet'}
            subtitle={!query ? 'Add your first customer to get started.' : undefined}
            actionLabel={!query ? 'Add Customer' : undefined}
            onAction={!query ? () => navigation.navigate('AddCustomer') : undefined}
          />
        }
      />

      {/* Wide Add Customer FAB */}
      <View style={styles.fabContainer}>
        <Pressable
          style={({ pressed }) => [styles.wideFab, pressed && { opacity: 0.9 }]}
          android_ripple={{ color: 'rgba(232,160,32,0.3)' }}
          onPress={() => navigation.navigate('AddCustomer')}
        >
          <Ionicons name="person-add" size={20} color={COLORS.gold} style={{ marginRight: 8 }} />
          <Text style={styles.wideFabText}>Add Customer</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
    ...shadows.sm,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  list: { paddingHorizontal: 12, paddingBottom: 100 },

  customerRow: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    ...shadows.sm,
  },
  customerInfo: { flex: 1, marginLeft: 12 },
  customerName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  customerPhone: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  lastActivity: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  balanceContainer: { alignItems: 'flex-end' },
  owedPill: {
    backgroundColor: COLORS.coralLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  owedPillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: COLORS.coral,
  },
  owesLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  settledBadge: {
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  settledText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: COLORS.emerald,
    fontSize: 12,
  },

  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  wideFab: {
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    ...shadows.lg,
  },
  wideFabText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: COLORS.white,
    fontSize: 16,
  },
});

export default CustomerListScreen;
