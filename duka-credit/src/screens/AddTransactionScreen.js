import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Alert, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllCustomers } from '../db/customers';
import { addTransaction } from '../db/transactions';
import { formatKES, getInitials } from '../utils/formatters';
import { COLORS } from '../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

const AddTransactionScreen = ({ route, navigation }) => {
  // Pre-fill if navigated from a customer's screen
  const preselected = route.params || {};

  const [type, setType] = useState('credit'); // 'credit' | 'payment'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(
    preselected.customerId
      ? { id: preselected.customerId, name: preselected.customerName }
      : null
  );
  const [customers, setCustomers] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      try {
        setCustomers(getAllCustomers());
      } catch (e) {
        console.error(e);
      }
    }, [])
  );

  const filteredCustomers = pickerQuery
    ? customers.filter(c =>
        c.name.toLowerCase().includes(pickerQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(pickerQuery))
      )
    : customers;

  const handleSave = () => {
    if (!selectedCustomer) {
      Alert.alert('Select Customer', 'Please select a customer first.');
      return;
    }
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    setSaving(true);
    try {
      addTransaction(selectedCustomer.id, type, amountNum, description, note);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save transaction. Please try again.');
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Type toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'credit' && styles.typeBtnActiveCredit]}
            onPress={() => setType('credit')}
          >
            <Ionicons name="arrow-up-circle" size={22} color={type === 'credit' ? '#FFF' : COLORS.textSecondary} />
            <Text style={[styles.typeBtnText, type === 'credit' && styles.typeBtnTextActive]}>
              Credit Sale
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'payment' && styles.typeBtnActivePayment]}
            onPress={() => setType('payment')}
          >
            <Ionicons name="arrow-down-circle" size={22} color={type === 'payment' ? '#FFF' : COLORS.textSecondary} />
            <Text style={[styles.typeBtnText, type === 'payment' && styles.typeBtnTextActive]}>
              Payment Received
            </Text>
          </TouchableOpacity>
        </View>

        {/* Customer selector */}
        <Text style={styles.label}>Customer *</Text>
        <TouchableOpacity
          style={styles.customerSelector}
          onPress={() => setShowPicker(!showPicker)}
        >
          {selectedCustomer ? (
            <View style={styles.selectedCustomer}>
              <View style={styles.mini_avatar}>
                <Text style={styles.mini_avatar_text}>{getInitials(selectedCustomer.name)}</Text>
              </View>
              <Text style={styles.selectedName}>{selectedCustomer.name}</Text>
            </View>
          ) : (
            <Text style={styles.selectorPlaceholder}>Select a customer...</Text>
          )}
          <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {showPicker && (
          <View style={styles.pickerDropdown}>
            <TextInput
              style={styles.pickerSearch}
              placeholder="Search customers..."
              value={pickerQuery}
              onChangeText={setPickerQuery}
              autoFocus
            />
            {filteredCustomers.slice(0, 8).map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedCustomer(c);
                  setShowPicker(false);
                  setPickerQuery('');
                }}
              >
                <View style={styles.mini_avatar}>
                  <Text style={styles.mini_avatar_text}>{getInitials(c.name)}</Text>
                </View>
                <View>
                  <Text style={styles.pickerName}>{c.name}</Text>
                  <Text style={styles.pickerBalance}>Balance: {formatKES(c.balance)}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {filteredCustomers.length === 0 && (
              <Text style={styles.pickerEmpty}>No customers found</Text>
            )}
          </View>
        )}

        {/* Amount */}
        <Text style={styles.label}>Amount (KES) *</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor={COLORS.textMuted}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />

        {/* Description */}
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder={type === 'credit' ? 'e.g. Sugar 2kg, Unga 5kg...' : 'e.g. Cash payment, M-PESA...'}
          placeholderTextColor={COLORS.textMuted}
          value={description}
          onChangeText={setDescription}
        />

        {/* Note */}
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Any additional notes..."
          placeholderTextColor={COLORS.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={2}
        />

        {/* Summary */}
        {selectedCustomer && amount && parseFloat(amount) > 0 && (
          <View style={[styles.summary, type === 'credit' ? styles.summaryCred : styles.summaryPay]}>
            <Ionicons
              name={type === 'credit' ? 'information-circle' : 'checkmark-circle'}
              size={18}
              color={type === 'credit' ? COLORS.danger : COLORS.accent}
            />
            <Text style={[styles.summaryText, { color: type === 'credit' ? COLORS.danger : COLORS.accent }]}>
              {type === 'credit'
                ? `${selectedCustomer.name} will owe you ${formatKES(parseFloat(amount))}`
                : `${selectedCustomer.name} is paying ${formatKES(parseFloat(amount))}`}
            </Text>
          </View>
        )}

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? 'Saving...' : `Confirm ${type === 'credit' ? 'Credit' : 'Payment'}`}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16 },

  typeToggle: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  typeBtnActiveCredit: { backgroundColor: COLORS.danger, borderColor: COLORS.danger },
  typeBtnActivePayment: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  typeBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  typeBtnTextActive: { color: '#FFF' },

  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, marginTop: 12 },

  customerSelector: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: COLORS.border,
  },
  selectedCustomer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectorPlaceholder: { color: COLORS.textMuted, fontSize: 15 },
  selectedName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  mini_avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  mini_avatar_text: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },

  pickerDropdown: {
    backgroundColor: COLORS.surface, borderRadius: 10, borderWidth: 1,
    borderColor: COLORS.border, marginTop: 4, overflow: 'hidden',
  },
  pickerSearch: {
    padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    fontSize: 15, color: COLORS.textPrimary,
  },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.background,
  },
  pickerName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  pickerBalance: { fontSize: 12, color: COLORS.textSecondary },
  pickerEmpty: { padding: 16, color: COLORS.textMuted, textAlign: 'center' },

  amountInput: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 16,
    fontSize: 32, fontWeight: 'bold', color: COLORS.textPrimary,
    borderWidth: 1, borderColor: COLORS.border, textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 14,
    fontSize: 15, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border,
  },
  noteInput: { minHeight: 60, textAlignVertical: 'top' },

  summary: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, marginTop: 16 },
  summaryCred: { backgroundColor: COLORS.dangerLight },
  summaryPay: { backgroundColor: COLORS.accentLight },
  summaryText: { fontSize: 14, fontWeight: '600', flex: 1 },

  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 20,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
});

export default AddTransactionScreen;
