import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { shadows } from '../theme/shadows';

const DukaCard = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    ...shadows.md,
  },
});

export default DukaCard;
