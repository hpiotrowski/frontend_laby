const PokemonList = ({ pokemonList }) => {
    if (pokemonList.length === 0) {
        return <p>Ładowanie listy Pokemonów...</p>;
    }

    return (
        <div id="pokemonList">
            <h3>Lista Pokemonów:</h3>
            <div className="pokemon-grid">
                {pokemonList.map((pokemon, index) => (
                    <button
                        key={index}
                        onClick={() => pobierzDane(pokemon.name)}
                        className="pokemon-card"
                    >
                        <img
                            src={pokemon.sprite}
                            alt={pokemon.name}
                            className="pokemon-img"
                        />
                        <span className="pokemon-name">
                            {index + 1}. {pokemon.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};