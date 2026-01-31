import React, { useState, useEffect } from 'react'
import './App.css'


// ============================================
// POKEMON CARD COMPONENT
// Displays detailed view of a single pokemon
// Shows: name, image, types, abilities, and stats
// ============================================
function PokemonCard({ pokemon }) {
  return (
    <div className="bg-black rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center overflow-hidden">
      {/* Pokemon Name - Bold and centered at top */}
      <h2 className="text-2xl font-bold text-white capitalize mb-4 text-center">
        {pokemon.name}
      </h2>

      {/* Pokemon Image - Large official artwork with NO scrollbars */}
      <div className="w-48 h-48 mb-4 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Pokemon Types - Colored badges */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {pokemon.types.map((type, index) => (
          <span
            key={index}
            className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${getTypeColor(type)}`}
          >
            {type}
          </span>
        ))}
      </div>

      {/* Pokemon Abilities */}
      <div className="w-full mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2 text-center">Abilities</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {pokemon.abilities.map((ability, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
            >
              {ability}
            </span>
          ))}
        </div>
      </div>

      {/* Pokemon Stats */}
      <div className="w-full space-y-2">
        <h3 className="text-sm font-semibold text-gray-300 mb-2 text-center">Stats</h3>
        {pokemon.stats.map((stat, index) => (
          <div key={index} className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white capitalize font-medium">{stat.name}</span>
              <span className="text-indigo-600 font-bold">{stat.value}</span>
            </div>
            {/* Progress bar for stat visualization */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(stat.value, 255) / 255 * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// POKEMON LIST ITEM COMPONENT
// Displays a pokemon in the list view
// Shows small image and name, clickable
// ============================================
function PokemonListItem({ pokemon, index, onClick, isSelected }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-indigo-900 ${
        isSelected ? 'bg-indigo-800 border-2 border-indigo-500' : 'bg-gray-800 hover:shadow-md'
      }`}
    >
      {/* List number */}
      <span className="text-gray-400 font-semibold min-w-[30px]">{index + 1}.</span>
      
      {/* Pokemon small image */}
      <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      {/* Pokemon name */}
      <span className="text-white font-medium capitalize flex-1 text-left">
        {pokemon.name}
      </span>
    </button>
  )
}

// ============================================
// HELPER FUNCTION
// Returns Tailwind color class for each Pokemon type
// ============================================
function getTypeColor(type) {
  const typeColors = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-700',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-700',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  }
  return typeColors[type.toLowerCase()] || 'bg-gray-400'
}

// ============================================
// MAIN APP COMPONENT
// Manages the entire Pokemon Explorer interface
// Fetches data from PokéAPI
// ============================================
function App() {
  // ========== STATE MANAGEMENT ==========
  const [pokemonList, setPokemonList] = useState([]) // All loaded pokemon
  const [selectedPokemon, setSelectedPokemon] = useState(null) // Currently selected pokemon
  const [searchQuery, setSearchQuery] = useState('') // Search input value
  const [loading, setLoading] = useState(false) // Loading state for API calls
  const [offset, setOffset] = useState(0) // Pagination offset for loading more
  const [hasMore, setHasMore] = useState(true) // Flag to check if more pokemon available
  const LIMIT = 10 // Will add/load 10 pokemon only

  // ========== FETCH POKEMON LIST ==========
  // Fetches list of pokemon from PokéAPI with pagination
  const fetchPokemonList = async (offsetValue = 0, append = false) => {
    setLoading(true)
    try {
      // Fetch list of pokemon with pagination to look better
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offsetValue}` //task atleast 10
      )
      const data = await response.json()

      // Fetch detailed data for each pokemon in parallel
      const pokemonDetailsPromises = data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url)
        const detailData = await detailResponse.json()
        
        return {
          id: detailData.id,
          name: detailData.name,
          image: detailData.sprites.other['official-artwork'].front_default,
          types: detailData.types.map((t) => t.type.name),
          abilities: detailData.abilities.map((a) => a.ability.name),
          stats: detailData.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
        }
      })

      const pokemonDetails = await Promise.all(pokemonDetailsPromises)

      // Append or replace pokemon list based on append flag
      if (append) {
        setPokemonList((prev) => [...prev, ...pokemonDetails])
      } else {
        setPokemonList(pokemonDetails)
      }

      // Check if there are more pokemon to load
      setHasMore(data.next !== null)
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
      alert('Failed to fetch Pokemon. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  // ========== INITIAL LOAD ==========
  // Load first batch of pokemon on component mount
  useEffect(() => {
    fetchPokemonList(0, false)
  }, [])

  // ========== FILTERED POKEMON LIST ==========
  // Filter pokemon based on search query
  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ========== HANDLER: LOAD MORE ==========
  // Fetches next batch of pokemon and appends to list
  const handleLoadMore = () => {
    const newOffset = offset + LIMIT
    setOffset(newOffset)
    fetchPokemonList(newOffset, true)
  }

  // ========== HANDLER: SEARCH ==========
  // Triggers search (filter is already applied through filteredPokemon)
  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      // Filter is automatically applied via filteredPokemon
      // If no results found in current list, user can load more
    }
  }

  // ========== HANDLER: SELECT POKEMON ==========
  // Sets the selected pokemon to display details
  const handleSelectPokemon = (pokemon) => {
    setSelectedPokemon(pokemon)
  }

  return (
    // Main container - full screen with gradient background
    <div className="min-h-screen bg-black py-4 px-4 sm:py-8">
      {/* Center container - responsive width */}
      <div className="container mx-auto max-w-6xl">
        
        {/* ========== HEADER SECTION ========== */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-indigo-400 mb-2">
            Pokémon Explorer
          </h1>
          <p className="text-center text-gray-400 text-sm sm:text-base">
            Search Pokémon by name or Load 10 Pokémon to the list
          </p>
        </div>

        {/* ========== SEARCH AND BUTTONS SECTION ========== */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Pokémon by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-400"
            />
          </div>

          {/* Buttons - Responsive flex layout */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              🔍 Search
            </button>

            {/* Load More Button */}
            <button
              onClick={handleLoadMore}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !hasMore}
            >
              {loading ? '⏳ Loading...' : hasMore ? '⬇️ Load More Pokémon' : '✅ All Loaded'}
            </button>
          </div>
        </div>

        {/* ========== MAIN CONTENT AREA ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT SIDE: Pokemon List - Scrollable */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Lists of Pokémon ({filteredPokemon.length})
            </h2>
            
            {/* Loading indicator */}
            {loading && pokemonList.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-gray-400 mt-4">Loading Pokémon...</p>
              </div>
            )}

            {/* Scrollable list container - max height with scroll */}
            {!loading || pokemonList.length > 0 ? (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPokemon.length > 0 ? (
                  filteredPokemon.map((pokemon, index) => (
                    <PokemonListItem
                      key={pokemon.id}
                      pokemon={pokemon}
                      index={index}
                      onClick={() => handleSelectPokemon(pokemon)}
                      isSelected={selectedPokemon?.id === pokemon.id}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8">
                    {searchQuery
                      ? `No Pokémon found matching "${searchQuery}". Try loading more or a different search.`
                      : 'No Pokémon loaded yet.'}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {/* RIGHT SIDE: Pokemon Detail Card */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6">
            {selectedPokemon ? (
              // Show selected pokemon details
              <PokemonCard pokemon={selectedPokemon} />
            ) : (
              // Show placeholder when no pokemon selected
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Select a Pokémon
                </h3>
                <p className="text-gray-400">
                  Click on any Pokémon from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App