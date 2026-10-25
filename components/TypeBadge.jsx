// components/TypeBadge.jsx
// Badge for one Pokémon type, with its own color from the team palette.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getTypeColor, getTypeName, getTypeTextColor } from '../constants/typeColors';

export default function TypeBadge({ type }) {
  return (
    <View
      style={[styles.badge, { backgroundColor: getTypeColor(type) }]}
      accessible
      accessibilityLabel={`Tipo ${getTypeName(type)}`}
    >
      <Text style={[styles.text, { color: getTypeTextColor(type) }]}>{getTypeName(type)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999, // pill shape
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
