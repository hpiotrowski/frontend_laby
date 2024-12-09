window.pokemonList = [];
window.pokemonDetails = null;
window.errorMessage = null;

const pokemonURL = "https://pokeapi.co/api/v2/pokemon";
window.renderApp = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
};

window.listaPokemonow = async () => {
    try {
        const response = await fetch(`${pokemonURL}?limit=20`);
        if (!response.ok) {
            throw new Error("Nie udało się pobrać listy Pokemonów.");
        }
        const data = await response.json();
        window.pokemonList = data.results;

        const pokemonDetailsPromises = window.pokemonList.map(async (pokemon) => {
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
        window.pokemonList = detailedPokemonData;  
        window.errorMessage = null;
    } catch (error) {
        window.errorMessage = error.message;
        window.pokemonList = [];
    }
    window.renderApp();
};

window.pobierzDane = async (pokemonName) => {
    const url = `${pokemonURL}/${pokemonName.toLowerCase()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Błąd: Nie znaleziono Pokemona o nazwie "${pokemonName}".`);
        }
        const data = await response.json();
        window.pokemonDetails = {
            name: data.name,
            id: data.id,
            sprite: data.sprites.front_default,
            height: data.height,
            weight: data.weight,
            types: data.types.map(type => type.type.name),
        };
        window.errorMessage = null;
    } catch (error) {
        window.errorMessage = error.message;
        window.pokemonDetails = null;
    }
    window.renderApp();
};
window.listaPokemonow()