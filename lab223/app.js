const pokemonURL = "https://pokeapi.co/api/v2/pokemon";

const listaPokemonow = async () => {
    try {
        const response = await fetch(`${pokemonURL}?limit=20`);
        if (!response.ok) {
            throw new Error("Nie udało się pobrać listy Pokemonów.");
        }
        const data = await response.json();
        const pokemonDetailsPromises = data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            return {
                name: pokemon.name,
                id: data.id,
                sprite: data.sprites.front_default,
                height: data.height,
                weight: data.weight,
                types: data.types.map((type) => type.type.name),
            };
        });

        const detailedPokemonData = await Promise.all(pokemonDetailsPromises);
        displayListaPokemonow(detailedPokemonData);
    } catch (error) {
        console.error(error.message);
        displayErrorMessage(error.message);
    }
};

const pobierzDane = async (pokemonName) => {
    const url = `${pokemonURL}/${pokemonName.toLowerCase()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Błąd: Nie znaleziono Pokemona o nazwie "${pokemonName}".`);
        }
        const data = await response.json();
        displayPokemona(data);
    } catch (error) {
        console.error(error.message);
        displayErrorMessage(error.message);
    }
};

const displayPokemona = (pokemon) => {
    ReactDOM.render(
        <PokemonDetails 
            pokemon={{
                name: pokemon.name,
                sprite: pokemon.sprites.front_default,
                weight: pokemon.weight,
                height: pokemon.height,
                types: pokemon.types.map(type => type.type.name)
            }}
            onBack={listaPokemonow}
        />,
        document.getElementById('root')
    );
};

const displayListaPokemonow = (pokemons) => {
    ReactDOM.render(
        <App pokemonList={pokemons} />,
        document.getElementById('root')
    );
};

const displayErrorMessage = (message) => {
    ReactDOM.render(
        <ErrorMessage message={message} onBack={listaPokemonow} />,
        document.getElementById('root')
    );
};

listaPokemonow();