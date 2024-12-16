'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PokemonList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');

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

    if (loading) {
        return <div>Ładowanie...</div>;
    }

    if (error) {
        return <div>Wystąpił błąd podczas ładowania danych.</div>;
    }

    return (
        <div className="pokemon-grid">
            {pokemons.map((pokemon) => (
                <div
                    key={pokemon.id}
                    className="pokemon-card"
                    onClick={() => router.push(`/pokemon/${pokemon.id}`)}
                >
                    <img src={pokemon.sprite} alt={pokemon.name} />
                    <h3>{pokemon.name}</h3>
                    <div className="pokemon-types">
                        {pokemon.types.map((type, index) => (
                            <span key={index} className={`pokemon-type type-${type}`}>
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PokemonList;
