import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  ScrollView, Alert, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllCustomers } from '../db/customers';
import { addTransaction } from '../db/transactions';
import { formatKES, getInitials } from '../utils/formatters';
import { COLORS } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { useFocusEffect } from '@react-navigation/native';
import DukaAvatar from '../components/DukaAvatar';
import DukaButton from '../components/DukaButton';

const AddTransactionScreen = ({ route, navigation }) => {
  const preselected = route.params || {};

  const [type, setType] = useState('credit');
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

  const isCredit = type === 'credit';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.navy} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Pill toggle */}
        <View style={styles.toggleContainer}>
          <Pressable
            style={[styles.toggleBtn, isCredit && styles.toggleBtnCreditActive]}
            onPress={() => setType('credit')}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Ionicons
              name="arrow-up-circle"
              size={18}
              color={isCredit ? COLORS.white : COLORS.textSecondary}
            />
            <Text style={[styles.toggleBtnText, isCredit && styles.toggleBtnTextActive]}>
              Credit Sale
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, !isCredit && styles.toggleBtnPaymentActive]}
            onPress={() => setType('payment')}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Ionicons
              name="arrow-down-circle"
              size={18}
              color={!isCredit ? COLORS.white : COLORS.textSecondary}
            />
            <Text style={[styles.toggleBtnText, !isCredit && styles.toggleBtnTextActive]}>
              Payment
            </Text>
          </Pressable>
        </View>

        {/* Customer selector */}
        <Text style={styles.label}>Customer *</Text>
        <Pressable
          style={styles.customerSelector}
          onPress={() => setShowPicker(!showPicker)}
          android_ripple={{ color: COLORS.border }}
        >
          {selectedCustomer ? (
            <View style={styles.selectedCustomer}>
              <DukaAvatar name={selectedCustomer.name} size="sm" />
              <Text style={styles.selectedName}>{selectedCustomer.name}</Text>
            </View>
          ) : (
            <Text style={styles.selectorPlaceholder}>Select a customer...</Text>
          )}
          <Ionicons
            name={showPicker ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={COLORS.textSecondary}
          />
        </Pressable>

        {showPicker && (
          <View style={styles.pickerDropdown}>
            <TextInput
              style={styles.pickerSearch}
              placeholder="Search customers..."
              placeholderTextColor={COLORS.textMuted}
              value={pickerQuery}
              onChangeText={setPickerQuery}
              autoFocus
            />
            {filteredCustomers.slice(0, 8).map(c => (
              <Pressable
                key={c.id}
                style={styles.pickerItem}
                android_ripple={{ color: COLORS.border }}
                onPress={() => {
                  setSelectedCustomer(c);
                  setShowPicker(false);
                  setPickerQuery('');
                }}
              >
                <DukaAvatar name={c.name} size="sm" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.pickerName}>{c.name}</Text>
                  <Text style={styles.pickerBalance}>Balance: {formatKES(c.balance)}</Text>
                </View>
              </Pressable>
            ))}
            {filteredCustomers.length === 0 && (
              <Text style={styles.pickerEmpty}>No customers found</Text>
            )}
          </View>
        )}

        {/* Amount */}
        <Text style={styles.label}>Amount (KES) *</Text>
        <TextInput
          style={[styles.amountInput, isCredit ? styles.amountInputCredit : styles.amountInputPayment]}
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
          placeholder={isCredit ? 'e.g. Sugar 2kg, Unga 5kg...' : 'e.g. Cash payment, M-PESA...'}
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

        {/* Summary preview */}
        {selectedCustomer && amount && parseFloat(amount) > 0 && (
          <View style={[styles.summary, isCredit ? styles.summaryCred : styles.summaryPay]}>
            <Ionicons
              name={isCredit ? 'information-circle' : 'checkmark-circle'}
              size={18}
              color={isCredit ? COLORS.coral : COLORS.emerald}
            />
            <Text style={[styles.summaryText, { color: isCredit ? COLORS.coral : COLORS.emerald }]}>
              {isCredit
                ? `${selectedCustomer.name} will owe you ${formatKES(parseFloat(amount))}`
                : `${selectedCustomer.name} is paying ${formatKES(parseFloat(amount))}`}
            </Text>
          </View>
        )}

        <DukaButton
          label={saving ? 'Saving...' : `Confirm ${isCredit ? 'Credit' : 'Payment'}`}
          onPress={handleSave}
          loading={saving}
          variant="primary"
          size="lg"
          style={styles.saveBtn}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { padding: 16 },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...shadows.sm,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  toggleBtnCreditActive: { backgroundColor: COLORS.coral },
  toggleBtnPaymentActive: { backgroundColor: COLORS.emerald },
  toggleBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  toggleBtnTextActive: { color: COLORS.white },

  label: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },

  customerSelector: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  selectedCustomer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectorPlaceholder: {
    fontFamily: 'PlusJakartaSans_400Regular',
    color: COLORS.textMuted,
    fontSize: 15,
  },
  selectedName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  pickerDropdown: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    overflow: 'hidden',
    ...shadows.sm,
  },
  pickerSearch: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cream,
  },
  pickerName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  pickerBalance: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  pickerEmpty: {
    fontFamily: 'PlusJakartaSans_400Regular',
    padding: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  amountInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
    color: COLORS.textPrimary,
    borderWidth: 2,
    textAlign: 'center',
    ...shadows.sm,
  },
  amountInputCredit: { borderColor: COLORS.coral, color: COLORS.coral },
  amountInputPayment: { borderColor: COLORS.emerald, color: COLORS.emerald },

  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  noteInput: { minHeight: 60, textAlignVertical: 'top' },

  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  summaryCred: { backgroundColor: COLORS.coralLight },
  summaryPay: { backgroundColor: COLORS.emeraldLight },
  summaryText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    flex: 1,
  },

  saveBtn: { marginTop: 24, alignSelf: 'stretch' },
});

export default AddTransactionScreen;
