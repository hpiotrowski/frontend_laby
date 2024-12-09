const PokemonList = () => {
    if (window.pokemonList.length === 0) {  
        return <p>Ładowanie listy Pokemonów...</p>;
    }

    return (
        <div id="pokemonList">
            <h3 className="pokemon-list-heading">Lista Pokemonów:</h3>
            <div className="pokemon-grid">
                {window.pokemonList.map((pokemon, index) => (  
                    <button
                        key={index}
                        onClick={() => window.pobierzDane(pokemon.name)}  
                        className="pokemon-card"
                    >
                        <img
                            src={pokemon.sprite}
                            alt={pokemon.name}
                            className="pokemon-img"
                        />
                        <span className="pokemon-name">{index + 1}. {pokemon.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};