const pokemonURL = "https://pokeapi.co/api/v2/pokemon";

let pokemonList = [];
let pokemonDetails = null;
let errorMessage = null;

const listaPokemonow = async () => {
    try {
        const response = await fetch(`${pokemonURL}?limit=20`);
        if (!response.ok) {
            throw new Error("Nie udało się pobrać listy Pokemonów.");
        }
        const data = await response.json();
        pokemonList = data.results;

    
        const pokemonDetailsPromises = pokemonList.map(async (pokemon) => {
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
        pokemonList = detailedPokemonData;  
        errorMessage = null;
    } catch (error) {
        errorMessage = error.message;
        pokemonList = [];
    }
    renderApp();
};


const renderApp = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
};


const App = () => {
    return (
        <div>
            <h2>Wyszukaj Pokemona</h2>
            <PokemonSearch />
            <PokemonList />
            <PokemonDetails />
        </div>
    );
};


const PokemonSearch = () => {
    let searchQuery = '';

    const handleSearchChange = (event) => {
        searchQuery = event.target.value;
    };

    const handleSearch = () => {
        if (searchQuery) {
            pobierzDane(searchQuery);
        } else {
            alert("Wpisz nazwę Pokemona");
        }
    };

    return (
        <div className="search">
            <input
                type="text"
                placeholder="Wpisz nazwę pokemona"
                onChange={handleSearchChange}
            />
            <button onClick={handleSearch}>Szukaj</button>
        </div>
    );
};


const PokemonList = () => {
    if (pokemonList.length === 0) {
        return <p>Ładowanie listy Pokemonów...</p>;
    }

    return (
        <div id="pokemonList">
            <h3 className="pokemon-list-heading">Lista Pokemonów:</h3>
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
                        <span className="pokemon-name">{index + 1}. {pokemon.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};



const PokemonDetails = () => {
    if (errorMessage) {
        return <p style={{ color: 'red' }}>{errorMessage}</p>;
    }

    if (pokemonDetails) {
        return (
            <div id="pokemonDetails">
                <h3>{pokemonDetails.name.toUpperCase()}</h3>
                <img src={pokemonDetails.sprite} alt={pokemonDetails.name} />
                <p><strong>Waga:</strong> {pokemonDetails.weight / 10} kg</p>
                <p><strong>Wzrost:</strong> {pokemonDetails.height / 10} m</p>
                <p><strong>Typy:</strong> {pokemonDetails.types.join(', ')}</p>
            </div>
        );
    }

    return null;
};

const pobierzDane = async (pokemonName) => {
    const url = `${pokemonURL}/${pokemonName.toLowerCase()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Błąd: Nie znaleziono Pokemona o nazwie "${pokemonName}".`);
        }
        const data = await response.json();
        pokemonDetails = {
            name: data.name,
            id: data.id,
            sprite: data.sprites.front_default,
            height: data.height,
            weight: data.weight,
            types: data.types.map(type => type.type.name),
        };
        errorMessage = null;
    } catch (error) {
        errorMessage = error.message;
        pokemonDetails = null;
    }
    renderApp();
};

listaPokemonow();
renderApp(); 
