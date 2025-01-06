'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PokemonSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
            if (!response.ok) {
                throw new Error('Pokemon nie został znaleziony');
            }
            const data = await response.json();
            router.push(`/pokemon/${data.id}`);
        } catch (error) {
            alert('Pokemon nie został znaleziony');
        }
    };

    return (
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Wyszukaj Pokemona..."
                className="search-input"
            />
            <button type="submit" className="search-button">
                Szukaj
            </button>
        </form>
    );
};

export default PokemonSearch;