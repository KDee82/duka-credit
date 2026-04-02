import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  Pressable, Alert, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllCustomers } from '../db/customers';
import { addTransaction } from '../db/transactions';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import DukaButton from '../components/DukaButton';

export default function AddTransactionScreen({ navigation, route }) {
  const prefilledCustomerId = route.params?.customerId;
  const prefilledCustomerName = route.params?.customerName;

  const [type, setType] = useState('credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [customerId, setCustomerId] = useState(prefilledCustomerId || null);
  const [customerName, setCustomerName] = useState(prefilledCustomerName || '');
  const [customers, setCustomers] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCustomers(getAllCustomers());
  }, []);

  const handleSave = () => {
    if (!customerId) return Alert.alert('Error', 'Please select a customer');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return Alert.alert('Error', 'Please enter a valid amount');

    setSaving(true);
    try {
      addTransaction(customerId, type, amt, description.trim(), note.trim(), '');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save transaction');
      setSaving(false);
    }
  };

  const isCredit = type === 'credit';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </Pressable>
        <Text style={[styles.headerTitle, typography.headingLarge]}>New Transaction</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Type toggle */}
        <View style={styles.toggleWrap}>
          <Pressable
            style={[styles.toggleBtn, isCredit && styles.toggleActive, isCredit && { backgroundColor: COLORS.coral }]}
            onPress={() => setType('credit')}
          >
            <Ionicons name="arrow-up-circle-outline" size={18} color={isCredit ? COLORS.white : COLORS.textSecondary} />
            <Text style={[styles.toggleLabel, typography.labelLarge, { color: isCredit ? COLORS.white : COLORS.textSecondary }]}>
              Credit
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, !isCredit && styles.toggleActive, !isCredit && { backgroundColor: COLORS.emerald }]}
            onPress={() => setType('payment')}
          >
            <Ionicons name="arrow-down-circle-outline" size={18} color={!isCredit ? COLORS.white : COLORS.textSecondary} />
            <Text style={[styles.toggleLabel, typography.labelLarge, { color: !isCredit ? COLORS.white : COLORS.textSecondary }]}>
              Payment
            </Text>
          </Pressable>
        </View>

        {/* Amount input */}
        <View style={styles.amountSection}>
          <Text style={[styles.amountLabel, typography.labelMedium]}>AMOUNT (KES)</Text>
          <TextInput
            style={[styles.amountInput, typography.amountHero, { color: isCredit ? COLORS.coral : COLORS.emerald }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Customer picker */}
        <View style={styles.section}>
          <Text style={[styles.fieldLabel, typography.labelMedium]}>CUSTOMER</Text>
          <Pressable style={styles.pickerBtn} onPress={() => setShowPicker(!showPicker)}>
            <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.pickerText, typography.bodyMedium, !customerName && { color: COLORS.textMuted }]}>
              {customerName || 'Select customer…'}
            </Text>
            <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
          </Pressable>
          {showPicker && (
            <View style={styles.dropdownList}>
              {customers.map((c) => (
                <Pressable
                  key={c.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCustomerId(c.id);
                    setCustomerName(c.name);
                    setShowPicker(false);
                  }}
                >
                  <Text style={[styles.dropdownText, typography.bodyMedium]}>{c.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.fieldLabel, typography.labelMedium]}>DESCRIPTION</Text>
          <TextInput
            style={[styles.textInput, typography.bodyMedium]}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Groceries, Airtime…"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={[styles.fieldLabel, typography.labelMedium]}>NOTE (optional)</Text>
          <TextInput
            style={[styles.textInput, styles.noteInput, typography.bodyMedium]}
            value={note}
            onChangeText={setNote}
            placeholder="Any additional notes…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        <DukaButton
          label="Confirm Transaction"
          onPress={handleSave}
          loading={saving}
          style={styles.saveBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { marginRight: spacing.md },
  headerTitle: { color: COLORS.white },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: radius.xl,
    padding: 4,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  toggleActive: {},
  toggleLabel: {},
  amountSection: {
    backgroundColor: COLORS.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  amountLabel: {
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  amountInput: {
    textAlign: 'center',
    width: '100%',
  },
  section: { marginBottom: spacing.lg },
  fieldLabel: {
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.sm,
  },
  pickerText: { flex: 1, color: COLORS.textPrimary },
  dropdownList: {
    backgroundColor: COLORS.surface,
    borderRadius: radius.lg,
    marginTop: spacing.xs,
    ...shadows.md,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownText: { color: COLORS.textPrimary },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    color: COLORS.textPrimary,
    ...shadows.sm,
  },
  noteInput: { minHeight: 80, textAlignVertical: 'top' },
  saveBtn: { marginTop: spacing.md },
});
