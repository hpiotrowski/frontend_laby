'use client';
import React, { useState, useEffect } from 'react';

const PokemonDetails = ({ pokemon, onBack }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!pokemon || typeof pokemon.id === 'undefined') return;
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        setIsFavorite(favoriteIds.includes(pokemon.id));
    }, [pokemon]);

    const addToFavorites = () => {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        if (!favoriteIds.includes(pokemon.id)) {
            favoriteIds.push(pokemon.id);
            localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds));
            setIsFavorite(true);
        }
    };

    const removeFromFavorites = () => {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        const newFavoriteIds = favoriteIds.filter(id => id !== pokemon.id);
        localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));
        setIsFavorite(false);
    };

    if (!pokemon) return <div>Brak danych o pokemonie</div>;

    return (
        <div id="pokemonDetails">
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <div className="pokemon-stats">
                <p><strong>Waga:</strong> {(pokemon.weight / 10).toFixed(1)} kg</p>
                <p><strong>Wzrost:</strong> {(pokemon.height / 10).toFixed(1)} m</p>
                {pokemon.stats && (
                    <div className="stats-grid">
                        <p><strong>HP:</strong> {pokemon.stats.hp}</p>
                        <p><strong>Atak:</strong> {pokemon.stats.attack}</p>
                        <p><strong>Obrona:</strong> {pokemon.stats.defense}</p>
                        <p><strong>Sp. Atak:</strong> {pokemon.stats.specialAttack}</p>
                        <p><strong>Sp. Obrona:</strong> {pokemon.stats.specialDefense}</p>
                        <p><strong>Szybkość:</strong> {pokemon.stats.speed}</p>
                    </div>
                )}
            </div>
            <div className="pokemon-types">
                {pokemon.types.map((type, index) => (
                    <span key={index} className={`pokemon-type type-${type}`}>
                        {type}
                    </span>
                ))}
            </div>
            <div className="buttons-container">
                {!isFavorite ? (
                    <button onClick={addToFavorites}>Dodaj do ulubionych</button>
                ) : (
                    <button onClick={removeFromFavorites}>Usuń z ulubionych</button>
                )}
                <button onClick={onBack}>Wróć do listy</button>
            </div>
        </div>
    );
};

export default PokemonDetails;
