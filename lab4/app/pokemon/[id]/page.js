'use client';
import React, { useEffect, useState } from 'react';
import PokemonDetails from '@/app/components/PokemonDetails';
import { useRouter, useParams } from 'next/navigation';

const PokemonPage = () => {
    const router = useRouter();
    const params = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            if (!params.id) return;
            
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
                if (!response.ok) {
                    throw new Error(`Nie udało się pobrać danych o Pokémonie z id: ${params.id}`);
                }
                const data = await response.json();
                setPokemon({
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
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [params.id]);

    const handleBack = () => {
        router.push('/pokemon');
    };

    return (
        <div>
            {loading && <p>Ładowanie danych...</p>}
            {error && <p>Błąd: {error}</p>}
            {pokemon && <PokemonDetails pokemon={pokemon} onBack={handleBack} />}
        </div>
    );
};

export default PokemonPage;
