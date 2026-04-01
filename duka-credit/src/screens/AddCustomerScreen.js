import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { addCustomer } from '../db/customers';
import { COLORS } from '../utils/constants';
import { isValidPhone } from '../utils/formatters';

const AddCustomerScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter the customer\'s name.');
      return;
    }
    if (phone && !isValidPhone(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number (e.g. 0712 345 678).');
      return;
    }

    setSaving(true);
    try {
      const limit = creditLimit ? parseFloat(creditLimit) : 0;
      addCustomer(name.trim(), phone.trim(), limit);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save customer. Please try again.');
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Details</Text>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Wambua"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
            autoCapitalize="words"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 0712 345 678"
            placeholderTextColor={COLORS.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Text style={styles.hint}>Used to send SMS/WhatsApp notifications</Text>

          <Text style={styles.label}>Credit Limit (KES)</Text>
          <TextInput
            style={styles.input}
            placeholder="0 = no limit"
            placeholderTextColor={COLORS.textMuted}
            value={creditLimit}
            onChangeText={setCreditLimit}
            keyboardType="decimal-pad"
          />
          <Text style={styles.hint}>Set to 0 to allow unlimited credit</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Add Customer'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16 },

  card: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 18,
    marginBottom: 20, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },

  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: COLORS.background, borderRadius: 10, padding: 14,
    fontSize: 16, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border,
  },
  hint: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },

  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
});

export default AddCustomerScreen;
