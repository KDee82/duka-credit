import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, FONT_SIZES } from '../utils/constants';
import { addCustomer } from '../db/customers';

export default function AddCustomerScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+254');
  const [creditLimit, setCreditLimit] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Customer name is required.');
      return;
    }

    const limit = parseFloat(creditLimit.replace(/,/g, '')) || 0;
    const phoneVal = phone.trim() === '+254' ? '' : phone.trim();

    try {
      addCustomer(name.trim(), phoneVal || null, limit);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to add customer. Please try again.');
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        <View style={styles.section}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Kamau"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+254700000000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.textLight}
          />
          <Text style={styles.hint}>Format: +254XXXXXXXXX</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Credit Limit (KES)</Text>
          <TextInput
            style={styles.input}
            placeholder="0 = unlimited"
            value={creditLimit}
            onChangeText={setCreditLimit}
            keyboardType="decimal-pad"
            placeholderTextColor={COLORS.textLight}
          />
          <Text style={styles.hint}>Set to 0 for no credit limit</Text>
        </View>

        <Pressable
          style={styles.saveBtn}
          onPress={handleSave}
          android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: false }}
        >
          <Text style={styles.saveBtnText}>Add Customer</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  section: { marginHorizontal: 16, marginTop: 20 },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textLight, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  input: { backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: FONT_SIZES.md, color: COLORS.text, elevation: 1 },
  hint: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 4, marginLeft: 4 },
  saveBtn: { margin: 16, marginTop: 32, paddingVertical: 18, paddingHorizontal: 16, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', elevation: 2, minHeight: 56 },
  saveBtnText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
