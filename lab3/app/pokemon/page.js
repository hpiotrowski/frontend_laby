'use client';
import PokemonList from '../components/PokemonList';
import PokemonSearch from '../components/PokemonSearch';
import PokemonFilters from '../components/PokemonFilters';

export default function PokemonPage() {
    return (
        <div>
            <h1>Lista Pokemonów</h1>
            <PokemonSearch />
            <PokemonFilters />
            <PokemonList />
        </div>
    );
}