// components/StatBar.jsx
// One base stat: label, value and a bar whose width is proportional to
// the value over the maximum possible (255).
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MAX_STAT } from '../constants/statLabels';
import { colors } from '../constants/colors';

function getBarColor(value) {
  if (value < 50) return '#EF4444'; // low
  if (value < 90) return '#F59E0B'; // medium
  return '#22C55E'; // high
}

export default function StatBar({ label, value }) {
  // Proportional width: 255 -> 100 %, 35 -> ~14 %. Math.min protects the
  // layout if the API ever sends a value above the maximum.
  const percent = Math.min(value / MAX_STAT, 1) * 100;

  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value} de ${MAX_STAT}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: getBarColor(value) }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 96,
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  value: {
    width: 36,
    textAlign: 'right',
    marginRight: 10,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
