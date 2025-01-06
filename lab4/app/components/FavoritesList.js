'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FavoritesList = () => {
    const [favoritePokemons, setFavoritePokemons] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (typeof window === 'undefined') return;
            
            try {
                const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
                const validIds = favoriteIds.filter(id => id !== null && id !== undefined);
                
                if (validIds.length === 0) {
                    setFavoritePokemons([]);
                    return;
                }

                const pokemons = await Promise.all(
                    validIds.map(async (id) => {
                        try {
                            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                            if (!response.ok) {
                                console.error(`Nie udało się pobrać danych o Pokémonie z id: ${id}`);
                                return null;
                            }
                            const data = await response.json();
                            return {
                                id: data.id,
                                name: data.name,
                                sprite: data.sprites.front_default,
                                types: data.types.map(type => type.type.name)
                            };
                        } catch (error) {
                            console.error(`Error fetching pokemon ${id}:`, error);
                            return null;
                        }
                    })
                );
                setFavoritePokemons(pokemons.filter(pokemon => pokemon !== null));
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                setFavoritePokemons([]);
            }
        };

        fetchFavorites();
    }, []);

    const removeFavorite = (idToRemove) => {
        try {
            const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
            const newFavoriteIds = favoriteIds.filter(id => id !== idToRemove);
            localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));
            setFavoritePokemons(prev => prev.filter(pokemon => pokemon.id !== idToRemove));
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    if (favoritePokemons.length === 0) {
        return <div>Nie masz jeszcze żadnych ulubionych Pokemonów</div>;
    }

    return (
        <div className="favorites-grid">
            {favoritePokemons.map(pokemon => (
                <div key={pokemon.id} className="favorite-card">
                    <img 
                        src={pokemon.sprite} 
                        alt={pokemon.name}
                        onClick={() => router.push(`/pokemon/${pokemon.id}`)}
                        style={{ cursor: 'pointer' }}
                    />
                    <h4>{pokemon.name}</h4>
                    <button 
                        onClick={() => removeFavorite(pokemon.id)}
                        className="remove-favorite"
                    >
                        Usuń z ulubionych
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FavoritesList; 