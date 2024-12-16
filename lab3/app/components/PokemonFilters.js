'use client';
import { useRouter, useSearchParams } from 'next/navigation';

const PokemonFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilters = (newParams) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
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
