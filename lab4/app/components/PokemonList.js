'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ComparisonView from './ComparisonView';

const PokemonList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [comparisonPokemons, setComparisonPokemons] = useState(() => {
        if (typeof window === 'undefined') return { pokemon1: null, pokemon2: null };
        try {
            const saved = localStorage.getItem('comparisonPokemons');
            return saved ? JSON.parse(saved) : { pokemon1: null, pokemon2: null };
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return { pokemon1: null, pokemon2: null };
        }
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');

    useEffect(() => {
        const initializeComparison = async () => {
            if (typeof window === 'undefined') return;
            try {
                const saved = localStorage.getItem('comparisonPokemons');
                if (!saved) return;

                const savedData = JSON.parse(saved);
                if (!savedData.pokemon1 && !savedData.pokemon2) return;

                const fetchFullPokemonData = async (id) => {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                    const data = await response.json();
                    return {
                        id: data.id,
                        name: data.name,
                        sprite: data.sprites.front_default,
                        weight: data.weight,
                        height: data.height,
                        types: data.types.map((type) => type.type.name),
                        stats: {
                            hp: data.stats[0].base_stat,
                            attack: data.stats[1].base_stat,
                            defense: data.stats[2].base_stat,
                            specialAttack: data.stats[3].base_stat,
                            specialDefense: data.stats[4].base_stat,
                            speed: data.stats[5].base_stat
                        }
                    };
                };

                const newState = { pokemon1: null, pokemon2: null };
                if (savedData.pokemon1) {
                    newState.pokemon1 = await fetchFullPokemonData(savedData.pokemon1.id);
                }
                if (savedData.pokemon2) {
                    newState.pokemon2 = await fetchFullPokemonData(savedData.pokemon2.id);
                }
                setComparisonPokemons(newState);
            } catch (error) {
                console.error('Error initializing comparison:', error);
                localStorage.removeItem('comparisonPokemons');
            }
        };

        initializeComparison();
    }, []);

    useEffect(() => {
        const fetchPokemons = async () => {
            setLoading(true);
            setError(false);

            try {
                let rawPokemonList = [];

                if (type) {
                    
                    const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
                    if (!typeResponse.ok) throw new Error('Failed to fetch pokemon type');
                    const typeData = await typeResponse.json();
                    
                    rawPokemonList = typeData.pokemon.map((p) => p.pokemon);
                } else {
                    
                    const allResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
                    if (!allResponse.ok) throw new Error('Failed to fetch general pokemon list');
                    const allData = await allResponse.json();
                    rawPokemonList = allData.results; 
                }

                
                let filtered = rawPokemonList;
                if (search) {
                    filtered = filtered.filter(p =>
                        p.name.toLowerCase().includes(search.toLowerCase())
                    );
                }

               
                filtered = filtered.slice(0, limit);

               
                const detailedPokemons = await Promise.all(
                    filtered.map(async (pokemon) => {
                        try {
                            const res = await fetch(pokemon.url);
                            if (!res.ok) throw new Error('Failed to fetch pokemon details');
                            const details = await res.json();
                            return {
                                id: details.id,
                                name: details.name,
                                sprite: details.sprites.front_default,
                                types: details.types.map((t) => t.type.name),
                            };
                        } catch (err) {
                            console.error(`Error fetching details for ${pokemon.name}:`, err);
                            return null;
                        }
                    })
                );

                const finalPokemons = detailedPokemons.filter(p => p !== null);
                setPokemons(finalPokemons);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching pokemon data:', err);
                setError(true);
                setLoading(false);
            }
        };

        fetchPokemons();
    }, [type, search, limit]);

    const handleCompare = async (pokemon) => {
        const fetchFullPokemonData = async (id) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            return {
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                weight: data.weight,
                height: data.height,
                types: data.types.map((type) => type.type.name),
                stats: {
                    hp: data.stats[0].base_stat,
                    attack: data.stats[1].base_stat,
                    defense: data.stats[2].base_stat,
                    specialAttack: data.stats[3].base_stat,
                    specialDefense: data.stats[4].base_stat,
                    speed: data.stats[5].base_stat
                }
            };
        };

        try {
            if (!comparisonPokemons.pokemon1) {
                const fullPokemonData = await fetchFullPokemonData(pokemon.id);
                const newState = { ...comparisonPokemons, pokemon1: fullPokemonData };
                setComparisonPokemons(newState);
                localStorage.setItem('comparisonPokemons', JSON.stringify(newState));
            } else if (!comparisonPokemons.pokemon2 && pokemon.id !== comparisonPokemons.pokemon1.id) {
                const fullPokemonData = await fetchFullPokemonData(pokemon.id);
                const newState = { ...comparisonPokemons, pokemon2: fullPokemonData };
                setComparisonPokemons(newState);
                localStorage.setItem('comparisonPokemons', JSON.stringify(newState));
            }
        } catch (error) {
            console.error('Error fetching Pokemon data for comparison:', error);
        }
    };

    const clearComparison = () => {
        setComparisonPokemons({ pokemon1: null, pokemon2: null });
        localStorage.removeItem('comparisonPokemons');
    };

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Wystąpił błąd podczas ładowania danych.</div>;

    return (
        <div>
            {comparisonPokemons.pokemon1 && comparisonPokemons.pokemon2 && (
                <ComparisonView 
                    pokemon1={comparisonPokemons.pokemon1}
                    pokemon2={comparisonPokemons.pokemon2}
                    onClear={clearComparison}
                />
            )}
            <div className="pokemon-grid">
                {pokemons.map((pokemon) => (
                    <div key={pokemon.id} className="pokemon-card">
                        <img 
                            src={pokemon.sprite} 
                            alt={pokemon.name}
                            onClick={() => router.push(`/pokemon/${pokemon.id}`)}
                            style={{ cursor: 'pointer' }}
                        />
                        <h3>{pokemon.name}</h3>
                        <div className="pokemon-types">
                            {pokemon.types.map((type, index) => (
                                <span key={index} className={`pokemon-type type-${type}`}>
                                    {type}
                                </span>
                            ))}
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCompare(pokemon);
                            }}
                            className="compare-button"
                            disabled={
                                comparisonPokemons.pokemon2 || 
                                (comparisonPokemons.pokemon1 && comparisonPokemons.pokemon1.id === pokemon.id)
                            }
                        >
                            Porównaj
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonList;
