const PokemonDetails = () => {
    if (window.errorMessage) { 
        return <p style={{ color: 'red' }}>{window.errorMessage}</p>;
    }

    if (window.pokemonDetails) { 
        return (
            <div id="pokemonDetails">
                <h3>{window.pokemonDetails.name.toUpperCase()}</h3>
                <img src={window.pokemonDetails.sprite} alt={window.pokemonDetails.name} />
                <p><strong>Waga:</strong> {window.pokemonDetails.weight / 10} kg</p>
                <p><strong>Wzrost:</strong> {window.pokemonDetails.height / 10} m</p>
                <p><strong>Typy:</strong> {window.pokemonDetails.types.join(', ')}</p>
            </div>
        );
    }

    return null;
};