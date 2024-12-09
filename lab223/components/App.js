const App = ({ pokemonList }) => {
    return (
        <div>
            <h2>Wyszukaj Pokemona</h2>
            <PokemonSearch />
            <PokemonList pokemonList={pokemonList} />
        </div>
    );
};