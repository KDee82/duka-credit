import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES, getInitials, formatRelativeDate } from '../utils/formatters';
import { getAllCustomers } from '../db/customers';

export default function CustomerListScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      const data = getAllCustomers();
      setCustomers(data);
    }, [])
  );

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={COLORS.textLight} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.customerRow}
            onPress={() =>
              navigation.navigate('CustomerDetail', {
                customerId: item.id,
                customerName: item.name,
              })
            }
          >
            <View style={[styles.avatar, item.balance > 0 && { backgroundColor: COLORS.danger }]}>
              <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>
                {item.phone || 'No phone'} ·{' '}
                {item.last_transaction_at
                  ? formatRelativeDate(item.last_transaction_at)
                  : 'No activity'}
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.balance, item.balance > 0 && { color: COLORS.danger }]}>
                {formatKES(item.balance)}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="person-add-outline" size={60} color={COLORS.border} />
            <Text style={styles.emptyText}>
              {search ? 'No customers match your search' : 'No customers yet'}
            </Text>
            {!search && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('AddCustomer')}
              >
                <Text style={styles.emptyBtnText}>Add First Customer</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddCustomer')}
        android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: false }}
      >
        <Ionicons name="add" size={22} color="#FFF" />
        <Text style={styles.fabText}>Add Customer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 1,
  },
  searchInput: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.text },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    elevation: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZES.md },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  sub: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  balance: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyText: { fontSize: FONT_SIZES.lg, color: COLORS.textLight, marginTop: 16, textAlign: 'center' },
  emptyBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyBtnText: { color: COLORS.white, fontWeight: '600', fontSize: FONT_SIZES.md },
  fab: {
    position: 'absolute', right: 16, bottom: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E5A9E', borderRadius: 28,
    paddingVertical: 14, paddingHorizontal: 20,
    elevation: 6, shadowColor: '#1E5A9E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 8,
    gap: 8,
  },
  fabText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
