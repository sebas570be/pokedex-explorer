// components/PokemonCard.jsx
// Card for the grid: image, number with 3 digits and capitalized name.
// Reusable: receives the Pokémon and what to do on press through props.
import React from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { capitalize, formatId } from '../utils/format';
import { colors } from '../constants/colors';

export default function PokemonCard({ pokemon, onPress }) {
  const name = capitalize(pokemon.name);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(pokemon)}
      accessibilityRole="button"
      accessibilityLabel={`${name}, número ${pokemon.id}. Ver ficha`}
    >
      {/* CONCEPT (class): a remote Image needs explicit width and height or it does not show */}
      <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.number}>{formatId(pokemon.id)}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cardPressed: {
    opacity: 0.7,
  },
  image: {
    width: 96,
    height: 96,
  },
  number: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
});
