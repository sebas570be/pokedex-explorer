// components/StatusView.jsx
// One reusable component for the non-success UI states:
//   loading -> spinner + text
//   error   -> clear message in Spanish + "Reintentar" button
//   empty   -> message when there are no results (+ optional action)
// Both views (list and detail) use it, so every state looks the same.
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function StatusView({ type, message, actionLabel, onAction }) {
  // The error state always offers "Reintentar" unless another label is given.
  const label = actionLabel ?? (type === 'error' ? 'Reintentar' : null);

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {type === 'loading' && <ActivityIndicator size="large" color={colors.primary} />}
      <Text style={[styles.message, type === 'error' && styles.error]}>{message}</Text>
      {label && onAction && (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onAction}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  message: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  },
  error: {
    color: colors.error,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
