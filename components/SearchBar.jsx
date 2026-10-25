// components/SearchBar.jsx
// Controlled search input + "Buscar" button.
// It does not search by itself: it only reports the text and the submit
// to the parent screen (props down, events up).
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';

export default function SearchBar({ value, onChangeText, onSubmit }) {
  return (
    <View style={styles.container}>
      {/* CONCEPT (class): TextInput controlled by state (value + onChangeText) */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Busca por nombre o número..."
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSubmit} // "Buscar" key on the phone keyboard
        accessibilityLabel="Buscar Pokémon por nombre o número"
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onSubmit}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Buscar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
