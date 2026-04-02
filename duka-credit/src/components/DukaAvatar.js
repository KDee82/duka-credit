import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { getInitials } from '../utils/formatters';

const AVATAR_COLORS = [
  { bg: COLORS.goldLight, text: COLORS.gold },
  { bg: COLORS.emeraldLight, text: COLORS.emerald },
  { bg: COLORS.coralLight, text: COLORS.coral },
  { bg: '#E8EDF8', text: COLORS.navy },
];

const SIZES = {
  sm: { outer: 36, fontSize: 13 },
  md: { outer: 44, fontSize: 16 },
  lg: { outer: 56, fontSize: 20 },
};

const DukaAvatar = ({ name = '', size = 'md' }) => {
  const charCode = (name.charCodeAt(0) || 0);
  const colorPair = AVATAR_COLORS[charCode % AVATAR_COLORS.length];
  const dim = SIZES[size];

  return (
    <View
      style={[
        styles.base,
        {
          width: dim.outer,
          height: dim.outer,
          borderRadius: dim.outer / 2,
          backgroundColor: colorPair.bg,
        },
      ]}
    >
      <Text style={[styles.text, { color: colorPair.text, fontSize: dim.fontSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: 'PlusJakartaSans_700Bold' },
});

export default DukaAvatar;
