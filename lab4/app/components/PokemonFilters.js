'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PokemonFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const savedFilters = localStorage.getItem('pokemonFilters');
            if (savedFilters) {
                const filters = JSON.parse(savedFilters);
                const currentParams = new URLSearchParams(window.location.search);
                if (!currentParams.toString()) {
                    updateFilters(filters);
                }
            }
        } catch (error) {
            console.error('Error reading filters from localStorage:', error);
        }
    }, []);

    const updateFilters = (newParams) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Zachowaj istniejące parametry, które nie są aktualizowane
        const currentFilters = {
            search: params.get('search') || '',
            type: params.get('type') || '',
            limit: params.get('limit') || '20'
        };

        // Połącz istniejące parametry z nowymi
        const updatedFilters = { ...currentFilters, ...newParams };

        // Ustaw parametry w URL
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        try {
            localStorage.setItem('pokemonFilters', JSON.stringify(updatedFilters));
        } catch (error) {
            console.error('Error saving filters to localStorage:', error);
        }

        router.push(`/pokemon?${params.toString()}`);
    };

    return (
        <div className="filters">
            <input
                type="text"
                placeholder="Filtruj po nazwie..."
                value={searchParams.get('search') || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
            />
            <select
                value={searchParams.get('type') || ''}
                onChange={(e) => updateFilters({ type: e.target.value })}
            >
                <option value="">Wszystkie typy</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="grass">Grass</option>
                <option value="electric">Electric</option>
                <option value="psychic">Psychic</option>
                <option value="ice">Ice</option>
                <option value="dragon">Dragon</option>
                <option value="dark">Dark</option>
                <option value="fairy">Fairy</option>
            </select>
            <select
                value={searchParams.get('limit') || '20'}
                onChange={(e) => updateFilters({ limit: e.target.value })}
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
        </div>
    );
};

export default PokemonFilters;
