// api/pokeApi.js
// The ONLY file in the app that talks to the PokéAPI.
// Screens and components never call fetch directly: they use these
// functions. If the API (or the HTTP library) changes, only this file changes.
import {
  getIdFromUrl,
  getArtworkUrl,
  decimetersToMeters,
  hectogramsToKilograms,
  normalizeSearch,
} from '../utils/format';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Shared GET request.
// CONCEPT (class): async/await -> fetch returns a Promise; await waits
// for the response without blocking the app.
async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);

  // CONCEPT (class): check response.ok BEFORE response.json().
  // fetch does NOT throw on 404/500: it only throws when there is no
  // network. A non-existing name returns 404 with plain text ("Not Found"),
  // so calling response.json() on it would crash with a parse error.
  if (!response.ok) {
    const error = new Error(`HTTP error ${response.status}`);
    error.status = response.status; // lets the UI tell "not found" from other errors
    throw error;
  }

  // CONCEPT (class): JSON -> response.json() turns the body into a JS object.
  return response.json();
}

// GET /pokemon?limit={n}&offset={m}  -> paginated list.
// Returns only what the list view needs: id, name and image.
export async function getPokemonList(limit = 20, offset = 0) {
  const data = await request(`/pokemon?limit=${limit}&offset=${offset}`);

  const items = (data.results ?? []).map((pokemon) => {
    const id = getIdFromUrl(pokemon.url);
    return {
      id,
      name: pokemon.name,
      image: getArtworkUrl(id),
    };
  });

  // "next" is null when there are no more pages (end of infinite scroll).
  return { items, hasMore: Boolean(data.next) };
}

// GET /pokemon/{name or id}  -> one Pokémon's detail.
// The real response is huge; we map it to a small object so the
// components do not depend on the API structure.
export async function getPokemonDetail(nameOrId) {
  const query = normalizeSearch(String(nameOrId ?? ''));
  if (!query) {
    const error = new Error('Empty search');
    error.status = 400;
    throw error;
  }

  const data = await request(`/pokemon/${encodeURIComponent(query)}`);

  return {
    id: data.id,
    name: data.name,
    // CONCEPT: bracket notation because "official-artwork" has a hyphen.
    // Optional chaining (?.) avoids a crash if a field is missing.
    image: data.sprites?.other?.['official-artwork']?.front_default ?? getArtworkUrl(data.id),
    heightMeters: decimetersToMeters(data.height),
    weightKilograms: hectogramsToKilograms(data.weight),
    types: (data.types ?? []).map((item) => item.type.name),
    stats: (data.stats ?? []).map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
  };
}
