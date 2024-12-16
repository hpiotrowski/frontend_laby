'use client';
import React, { useState, useEffect } from 'react';

const PokemonDetails = ({ pokemon, onBack }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        console.log('Sprawdzam obiekt pokemon:', pokemon);
        if (!pokemon || typeof pokemon.id === 'undefined') {
            console.error('pokemon.id jest niezdefiniowany!');
            return;
        }

        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        const pokemonId = Number(pokemon.id);

        console.log('pokemon.id:', pokemon.id);
        console.log('pokemonId po Number():', pokemonId);

        if (Number.isNaN(pokemonId)) {
            console.error('pokemonId jest NaN - sprawdź, czy pokemon.id to liczba!');
        } else {
            setIsFavorite(favoriteIds.includes(pokemonId));
        }
    }, [pokemon]);

    const addToFavorites = () => {
        

        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        const pokemonId = Number(pokemon.id);

        console.log('Dodaję do ulubionych pokemonId:', pokemonId);
       

        if (!favoriteIds.includes(pokemonId)) {
            favoriteIds.push(pokemonId);
            localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds));
            setIsFavorite(true);
            console.log('Po dodaniu ulubionych:', JSON.parse(localStorage.getItem('favoriteIds')));
        } else {
            console.log('Pokemon o id', pokemonId, 'jest już w ulubionych.');
        }
    };

    const removeFromFavorites = () => {
        if (!pokemon || typeof pokemon.id === 'undefined') {
            console.error('Nie można usunąć z ulubionych, ponieważ pokemon.id jest niezdefiniowany.');
            return;
        }

        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        const pokemonId = Number(pokemon.id);

        console.log('Usuwam z ulubionych pokemonId:', pokemonId);
       

        const newFavoriteIds = favoriteIds.filter(id => id !== pokemonId);
        localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));
        setIsFavorite(false);
        console.log('Po usunięciu ulubionych:', JSON.parse(localStorage.getItem('favoriteIds')));
    };

    if (!pokemon || typeof pokemon.id === 'undefined') {
        return <div>Brak danych o pokemonie</div>;
    }

    return (
        <div id="pokemonDetails">
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <p><strong>Waga:</strong> {pokemon.weight / 10} kg</p>
            <p><strong>Wzrost:</strong> {pokemon.height / 10} m</p>
            <div>
                {pokemon.types && pokemon.types.map((type, index) => (
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
