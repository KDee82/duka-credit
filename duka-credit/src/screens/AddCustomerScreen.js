import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { addCustomer } from '../db/customers';
import { COLORS } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { isValidPhone } from '../utils/formatters';
import DukaAvatar from '../components/DukaAvatar';
import DukaButton from '../components/DukaButton';

const AddCustomerScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', "Please enter the customer's name.");
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
      <StatusBar backgroundColor={COLORS.navy} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Avatar preview */}
        <View style={styles.avatarPreview}>
          <DukaAvatar name={name || '?'} size="lg" />
          <Text style={styles.avatarHint}>
            {name.trim() ? name.trim() : 'Customer preview'}
          </Text>
        </View>

        {/* Form card */}
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

        <DukaButton
          label={saving ? 'Saving...' : 'Save Customer'}
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

  avatarPreview: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarHint: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 12,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    ...shadows.md,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },

  label: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  hint: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  saveBtn: { alignSelf: 'stretch' },
});

export default AddCustomerScreen;
