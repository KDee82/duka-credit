import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllCustomers, searchCustomers } from '../db/customers';
import { formatKES, getInitials, formatRelativeDate } from '../utils/formatters';
import { COLORS } from '../utils/constants';

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate('AddCustomer')}
        >
          <Ionicons name="person-add" size={24} color="#FFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderCustomer = ({ item }) => (
    <TouchableOpacity
      style={styles.customerRow}
      onPress={() => navigation.navigate('CustomerDetail', {
        customerId: item.id,
        customerName: item.name,
      })}
    >
      <View style={[styles.avatar, item.balance > 0 && styles.avatarActive]}>
        <Text style={[styles.avatarText, item.balance > 0 && styles.avatarTextActive]}>
          {getInitials(item.name)}
        </Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone || 'No phone'}</Text>
        <Text style={styles.lastActivity}>
          {item.last_activity ? `Last: ${formatRelativeDate(item.last_activity)}` : 'No transactions yet'}
        </Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={[styles.balance, item.balance > 0 ? styles.balanceOwed : styles.balanceClear]}>
          {formatKES(item.balance)}
        </Text>
        {item.balance > 0 && (
          <Text style={styles.balanceLabel}>owes</Text>
        )}
        {item.balance <= 0 && (
          <View style={styles.settledBadge}>
            <Text style={styles.settledText}>Settled</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCustomer}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={56} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>
              {query ? 'No customers found' : 'No customers yet'}
            </Text>
            {!query && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCustomer')}
              >
                <Text style={styles.addButtonText}>Add Your First Customer</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, margin: 12, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary },

  list: { paddingHorizontal: 12, paddingBottom: 20 },

  customerRow: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarActive: { backgroundColor: COLORS.primaryLight },
  avatarText: { fontWeight: 'bold', fontSize: 17, color: COLORS.textSecondary },
  avatarTextActive: { color: COLORS.primary },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  customerPhone: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  lastActivity: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  balanceContainer: { alignItems: 'flex-end' },
  balance: { fontSize: 15, fontWeight: 'bold' },
  balanceOwed: { color: COLORS.danger },
  balanceClear: { color: COLORS.accent },
  balanceLabel: { fontSize: 11, color: COLORS.textMuted },
  settledBadge: {
    backgroundColor: COLORS.accentLight, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8, marginTop: 2,
  },
  settledText: { color: COLORS.accent, fontSize: 11, fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary, marginTop: 12 },
  addButton: {
    marginTop: 20, backgroundColor: COLORS.primary,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10,
  },
  addButtonText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
});

export default CustomerListScreen;
