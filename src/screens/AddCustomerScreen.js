import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  ScrollView, Alert, StatusBar, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addCustomer } from '../db/customers';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import DukaAvatar from '../components/DukaAvatar';
import DukaButton from '../components/DukaButton';

export default function AddCustomerScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Customer name is required');
    setSaving(true);
    try {
      await addCustomer(name.trim(), phone.trim(), parseFloat(creditLimit) || 0);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save customer: ' + (e?.message || 'Unknown error'));
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </Pressable>
        <Text style={[styles.headerTitle, typography.headingLarge]}>New Customer</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Avatar preview */}
        <View style={styles.avatarWrap}>
          <DukaAvatar name={name || '?'} size="xl" />
          <Text style={[styles.avatarHint, typography.bodySmall]}>
            {name.trim() ? name.trim() : 'Type a name below'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={[styles.fieldLabel, typography.labelMedium]}>FULL NAME *</Text>
          <TextInput
            style={[styles.input, typography.bodyLarge]}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Jane Wanjiku"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="words"
          />

          <View style={styles.divider} />

          <Text style={[styles.fieldLabel, typography.labelMedium]}>PHONE NUMBER</Text>
          <TextInput
            style={[styles.input, typography.bodyLarge]}
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. 0712 345 678"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="phone-pad"
          />

          <View style={styles.divider} />

          <Text style={[styles.fieldLabel, typography.labelMedium]}>CREDIT LIMIT (KES)</Text>
          <TextInput
            style={[styles.input, typography.bodyLarge]}
            value={creditLimit}
            onChangeText={setCreditLimit}
            placeholder="0 = unlimited"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

        <DukaButton
          label="Save Customer"
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
  avatarWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  avatarHint: {
    color: COLORS.textSecondary,
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  input: {
    color: COLORS.textPrimary,
    paddingVertical: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: spacing.md,
  },
  saveBtn: {},
});
