import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, TRANSACTION_TYPES } from '../utils/constants';
import { formatKES } from '../utils/formatters';
import { addTransaction } from '../db/transactions';
import { getAllCustomers, getCustomerById } from '../db/customers';

export default function AddTransactionScreen({ route, navigation }) {
  const prefillCustomerId = route.params?.customerId;
  const prefillCustomerName = route.params?.customerName;
  const defaultType = route.params?.defaultType || TRANSACTION_TYPES.CREDIT;

  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);

  useEffect(() => {
    const all = getAllCustomers();
    setCustomers(all);
    if (prefillCustomerId) {
      const c = getCustomerById(prefillCustomerId);
      setSelectedCustomer(c);
    }
  }, []);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.phone && c.phone.includes(customerSearch))
  );

  const handleSave = () => {
    if (!selectedCustomer) {
      Alert.alert('Missing Customer', 'Please select a customer.');
      return;
    }
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    addTransaction(selectedCustomer.id, type, parsed, description, note);
    navigation.goBack();
  };

  const isCredit = type === TRANSACTION_TYPES.CREDIT;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Type toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, isCredit && styles.toggleActive, isCredit && { backgroundColor: COLORS.danger }]}
            onPress={() => setType(TRANSACTION_TYPES.CREDIT)}
          >
            <Ionicons name="arrow-up-circle-outline" size={20} color={isCredit ? COLORS.white : COLORS.textLight} />
            <Text style={[styles.toggleText, isCredit && styles.toggleTextActive]}>CREDIT SALE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isCredit && styles.toggleActive, !isCredit && { backgroundColor: COLORS.accent }]}
            onPress={() => setType(TRANSACTION_TYPES.PAYMENT)}
          >
            <Ionicons name="arrow-down-circle-outline" size={20} color={!isCredit ? COLORS.white : COLORS.textLight} />
            <Text style={[styles.toggleText, !isCredit && styles.toggleTextActive]}>PAYMENT RECEIVED</Text>
          </TouchableOpacity>
        </View>

        {/* Customer selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Customer</Text>
          <TouchableOpacity
            style={[styles.selectorBtn, !selectedCustomer && { borderColor: COLORS.border }]}
            onPress={() => setShowCustomerPicker(!showCustomerPicker)}
          >
            <Ionicons name="person-outline" size={18} color={COLORS.textLight} />
            <Text style={[styles.selectorText, !selectedCustomer && { color: COLORS.textLight }]}>
              {selectedCustomer ? selectedCustomer.name : 'Select customer...'}
            </Text>
            <Ionicons name={showCustomerPicker ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textLight} />
          </TouchableOpacity>

          {selectedCustomer && (
            <View style={styles.selectedCustomerInfo}>
              <Text style={styles.selectedCustomerBalance}>
                Balance: {formatKES(selectedCustomer.balance)}
              </Text>
              {selectedCustomer.phone ? (
                <Text style={styles.selectedCustomerPhone}>{selectedCustomer.phone}</Text>
              ) : null}
            </View>
          )}

          {showCustomerPicker && (
            <View style={styles.picker}>
              <TextInput
                style={styles.pickerSearch}
                placeholder="Search customers..."
                placeholderTextColor={COLORS.textLight}
                value={customerSearch}
                onChangeText={setCustomerSearch}
                autoFocus
              />
              {filteredCustomers.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedCustomer(c);
                    setShowCustomerPicker(false);
                    setCustomerSearch('');
                  }}
                >
                  <Text style={styles.pickerItemName}>{c.name}</Text>
                  <Text style={styles.pickerItemBalance}>{formatKES(c.balance)}</Text>
                </TouchableOpacity>
              ))}
              {filteredCustomers.length === 0 && (
                <Text style={styles.pickerEmpty}>No customers found</Text>
              )}
            </View>
          )}
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount (KES)</Text>
          <TextInput
            style={[styles.amountInput, { borderColor: isCredit ? COLORS.danger : COLORS.accent }]}
            placeholder="0.00"
            placeholderTextColor={COLORS.border}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Unga 2kg, sugar..."
            placeholderTextColor={COLORS.textLight}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={[styles.textInput, { height: 80 }]}
            placeholder="Any extra notes..."
            placeholderTextColor={COLORS.textLight}
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: isCredit ? COLORS.danger : COLORS.accent }]}
          onPress={handleSave}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color={COLORS.white} />
          <Text style={styles.saveBtnText}>
            {isCredit ? 'Record Credit Sale' : 'Record Payment'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  toggleContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 6,
  },
  toggleActive: {},
  toggleText: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.textLight },
  toggleTextActive: { color: COLORS.white },
  section: { marginHorizontal: 16, marginBottom: 16 },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textLight, marginBottom: 6, textTransform: 'uppercase' },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  selectorText: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.text },
  selectedCustomerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  selectedCustomerBalance: { fontSize: FONT_SIZES.sm, color: COLORS.danger, fontWeight: '600' },
  selectedCustomerPhone: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  picker: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    maxHeight: 240,
    overflow: 'hidden',
  },
  pickerSearch: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerItemName: { fontSize: FONT_SIZES.md, color: COLORS.text },
  pickerItemBalance: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  pickerEmpty: { padding: 16, color: COLORS.textLight, textAlign: 'center' },
  amountInput: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
  },
  saveBtnText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
