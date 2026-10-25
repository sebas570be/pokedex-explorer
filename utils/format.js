// utils/format.js
// Pure helper functions: they receive a value and return a new one,
// without touching the API or the UI. That makes them easy to reuse
// in any component and easy to test.

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// Number with 3 digits and leading zeros: 25 -> "#025".
// CONCEPT (class): String.padStart to pad a text up to a fixed length.
export function formatId(id) {
  return `#${String(id).padStart(3, '0')}`;
}

// "pikachu" -> "Pikachu"
export function capitalize(text = '') {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// The list endpoint does NOT return the id, only the URL:
// "https://pokeapi.co/api/v2/pokemon/25/" -> 25
// filter(Boolean) removes the empty string left by the last "/".
export function getIdFromUrl(url = '') {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

// Image for the list cards, built from the id so we do not have to
// request the full detail of every Pokémon just to show its picture.
export function getArtworkUrl(id) {
  return `${ARTWORK_BASE_URL}/${id}.png`;
}

// The API returns height in decimeters and weight in hectograms.
export function decimetersToMeters(decimeters) {
  return decimeters / 10;
}

export function hectogramsToKilograms(hectograms) {
  return hectograms / 10;
}

// Search input -> value the API understands.
// - trim + toLowerCase: the API only accepts lowercase names without spaces.
// - "#025" or "025" -> "25": the API does not accept leading zeros.
export function normalizeSearch(text = '') {
  const clean = text.trim().toLowerCase().replace(/^#/, '');
  if (/^\d+$/.test(clean)) {
    return String(Number(clean));
  }
  return clean;
}
