const pokemonURL = "https://pokeapi.co/api/v2/pokemon";

// Funkcja renderująca aplikację
const renderApp = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
};

// Główna funkcja pobierająca listę pokemonów
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

// Funkcja pobierająca szczegóły pojedynczego pokemona
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

// Funkcje wyświetlające
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

// Komponenty React
const App = ({ pokemonList = [] }) => {
    return (
        <div>
            <h2>Wyszukaj Pokemona</h2>
            <PokemonSearch />
            <PokemonList pokemonList={pokemonList} />
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
            displayErrorMessage("Wpisz nazwę Pokemona.");
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
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '200px',
                            height: '50px',
                            marginBottom: '10px'
                        }}
                    >
                        <img
                            src={pokemon.sprite}
                            alt={pokemon.name}
                            style={{ width: '30px', marginRight: '10px' }}
                        />
                        <span>{index + 1}. {pokemon.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const PokemonDetails = ({ pokemon, onBack }) => {
    return (
        <div id="pokemonDetails">
            <h3>{pokemon.name.toUpperCase()}</h3>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <p><strong>Waga:</strong> {pokemon.weight / 10} kg</p>
            <p><strong>Wzrost:</strong> {pokemon.height / 10} m</p>
            <p><strong>Typy:</strong> {pokemon.types.join(', ')}</p>
            <button onClick={onBack}>Wróć do listy</button>
        </div>
    );
};

const ErrorMessage = ({ message, onBack }) => {
    return (
        <div>
            <p style={{ color: 'red' }}>{message}</p>
            <button onClick={onBack}>Wróć do listy</button>
        </div>
    );
};

// Inicjalizacja aplikacji
listaPokemonow();