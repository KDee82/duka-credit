import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { formatKES } from '../utils/formatters';
import { addTransaction } from '../db/transactions';
import { getAllCustomers } from '../db/customers';

export default function AddTransactionScreen({ route, navigation }) {
  const { customerId, customerName, defaultType } = route.params || {};

  const [type, setType] = useState(defaultType || 'credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customerId || null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(customerName || '');
  const [customers, setCustomers] = useState([]);
  const [showPicker, setShowPicker] = useState(!customerId);
  const [customerSearch, setCustomerSearch] = useState('');

  useEffect(() => {
    const data = getAllCustomers();
    setCustomers(data);
  }, []);

  const parsedAmount = parseFloat(amount.replace(/,/g, '')) || 0;

  const filteredCustomers = customers.filter((c) => {
    const q = customerSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q));
  });

  const handleConfirm = () => {
    if (!selectedCustomerId) {
      Alert.alert('Select Customer', 'Please select a customer first.');
      return;
    }
    if (parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    try {
      addTransaction(selectedCustomerId, type, parsedAmount, description.trim(), note.trim());
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        {/* Type toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'credit' && { backgroundColor: COLORS.danger }]}
            onPress={() => setType('credit')}
          >
            <Ionicons name="arrow-up-circle" size={18} color={type === 'credit' ? COLORS.white : COLORS.textLight} />
            <Text style={[styles.toggleText, type === 'credit' && { color: COLORS.white }]}>Credit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'payment' && { backgroundColor: COLORS.accent }]}
            onPress={() => setType('payment')}
          >
            <Ionicons name="arrow-down-circle" size={18} color={type === 'payment' ? COLORS.white : COLORS.textLight} />
            <Text style={[styles.toggleText, type === 'payment' && { color: COLORS.white }]}>Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Customer selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Customer</Text>
          {selectedCustomerId && !showPicker ? (
            <TouchableOpacity style={styles.customerSelected} onPress={() => setShowPicker(true)}>
              <Text style={styles.customerSelectedName}>{selectedCustomerName}</Text>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.pickerContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color={COLORS.textLight} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search customer..."
                  value={customerSearch}
                  onChangeText={setCustomerSearch}
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              {filteredCustomers.slice(0, 6).map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.customerOption}
                  onPress={() => {
                    setSelectedCustomerId(c.id);
                    setSelectedCustomerName(c.name);
                    setShowPicker(false);
                  }}
                >
                  <Text style={styles.customerOptionName}>{c.name}</Text>
                  <Text style={styles.customerOptionBalance}>{formatKES(c.balance)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount (KES)</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholderTextColor={COLORS.textLight}
          />
          {parsedAmount > 0 && (
            <Text style={styles.amountPreview}>{formatKES(parsedAmount)}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Unga, Sugar, Cooking oil..."
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={[styles.input, { height: 72 }]}
            placeholder="Any extra notes..."
            value={note}
            onChangeText={setNote}
            multiline
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Confirm button */}
        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: type === 'credit' ? COLORS.danger : COLORS.accent }]}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmBtnText}>
            {type === 'credit' ? 'Record Credit' : 'Record Payment'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  toggle: { flexDirection: 'row', margin: 16, backgroundColor: COLORS.white, borderRadius: 12, padding: 4, elevation: 1 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 6 },
  toggleText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textLight },
  section: { marginHorizontal: 16, marginBottom: 16 },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textLight, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  customerSelected: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 10, padding: 14, elevation: 1 },
  customerSelectedName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  changeText: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  pickerContainer: { backgroundColor: COLORS.white, borderRadius: 10, elevation: 1, overflow: 'hidden' },
  searchBar: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 8 },
  searchInput: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.text },
  customerOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  customerOptionName: { fontSize: FONT_SIZES.md, color: COLORS.text },
  customerOptionBalance: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  amountInput: { backgroundColor: COLORS.white, borderRadius: 10, padding: 16, fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, elevation: 1, textAlign: 'center' },
  amountPreview: { textAlign: 'center', marginTop: 6, fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  input: { backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: FONT_SIZES.md, color: COLORS.text, elevation: 1 },
  confirmBtn: { margin: 16, marginTop: 8, padding: 18, borderRadius: 14, alignItems: 'center', elevation: 2 },
  confirmBtnText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
