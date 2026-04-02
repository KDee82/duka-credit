import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';

const colorPalette = [
  { bg: COLORS.gold, text: COLORS.navy },
  { bg: COLORS.emerald, text: COLORS.white },
  { bg: COLORS.coral, text: COLORS.white },
  { bg: COLORS.navy, text: COLORS.white },
  { bg: COLORS.goldLight, text: COLORS.navy },
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColor(name) {
  if (!name) return colorPalette[0];
  const code = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[code];
}

const sizeMap = { sm: 36, md: 44, lg: 60, xl: 72 };
const fontSizeMap = { sm: 14, md: 16, lg: 22, xl: 28 };

export default function DukaAvatar({ name, size = 'md', style }) {
  const dim = sizeMap[size] || sizeMap.md;
  const fontSize = fontSizeMap[size] || fontSizeMap.md;
  const color = getColor(name);
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.avatar,
        { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: color.bg },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize, color: color.text }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.5,
  },
});
