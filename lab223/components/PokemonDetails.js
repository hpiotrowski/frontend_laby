const PokemonDetails = ({ pokemon, onBack }) => {
    return (
        <div id="pokemonDetails">
            <h3>{pokemon.name.toUpperCase()}</h3>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <p><strong>Waga:</strong> {pokemon.weight / 10}</p>
            <p><strong>Wzrost:</strong> {pokemon.height / 10}</p>
            <p><strong>Typy:</strong> {pokemon.types.join(', ')}</p>
            <button onClick={onBack}>Wróć do listy</button>
        </div>
    );
};