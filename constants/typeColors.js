// constants/typeColors.js
// Palette chosen by the team: one color per Pokémon type, plus the type
// name in Spanish (the API returns it in English).
import { capitalize } from '../utils/format';

export const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export const TYPE_NAMES_ES = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

// Light backgrounds need dark text to stay readable (accessibility: contrast).
const LIGHT_TYPES = ['electric', 'ice', 'ground', 'steel', 'normal', 'bug', 'rock', 'grass'];

const FALLBACK_COLOR = '#9CA3AF';

// Safe getters: if the API ever returns a new type we do not know,
// the app shows it in gray instead of crashing.
export function getTypeColor(type) {
  return TYPE_COLORS[type] ?? FALLBACK_COLOR;
}

export function getTypeTextColor(type) {
  return LIGHT_TYPES.includes(type) ? '#1F2937' : '#FFFFFF';
}

export function getTypeName(type) {
  return TYPE_NAMES_ES[type] ?? capitalize(type);
}
