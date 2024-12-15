const pokemonURL = "https://pokeapi.co/api/v2/pokemon";

async function pobierzDane(pokemonName) {
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
}


function displayPokemona(pokemon) {
    const detailsElement = document.getElementById("pokemonDetails");
    detailsElement.innerHTML = `
        <h3>${pokemon.name.toUpperCase()}</h3>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p><strong>Waga:</strong> ${pokemon.weight} </p>
        <p><strong>Wzrost:</strong> ${pokemon.height} </p>
        <p><strong>Typy:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}</p>
    `;
    const backButton = document.createElement("button");
    backButton.textContent = "Wróć do listy";
    backButton.addEventListener("click", () => listaPokemonow());
    detailsElement.appendChild(backButton);
}



function displayErrorMessage(message) {
    const detailsElement = document.getElementById("pokemonDetails");
    detailsElement.innerHTML = `<p style="color: red;">${message}</p>`;
    
    const backButton = document.createElement("button");
    backButton.textContent = "Wróć do listy";
    backButton.addEventListener("click", () => listaPokemonow());
    detailsElement.appendChild(backButton);
}

document.getElementById("searchButton").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
        pobierzDane(searchInput);
    } else {
        displayErrorMessage("Wpisz nazwę Pokemona.");
    }
});


async function listaPokemonow() {
    try {
        const response = await fetch(`${pokemonURL}?limit=${20}`);
        if (!response.ok) {
            throw new Error("Nie udało się pobrać listy Pokemonów.");
        }
        const data = await response.json();
        displayListaPokemonow(data.results);
    } catch (error) {
        console.error(error.message);
    }
}

async function displayListaPokemonow(pokemons) {
    const detailsElement = document.getElementById("pokemonDetails");
    detailsElement.innerHTML = "<h3>Lista Pokemonów:</h3>";
    pokemons.map(async (pokemon, index) => {
        const response = await fetch(pokemon.url);
        const data = await response.json();

        const button = document.createElement("button");
        button.innerHTML = `<img src="${data.sprites.front_default}" alt="${pokemon.name}" style="width:30px; margin-right:10px;"> ${index + 1}. ${pokemon.name}`;
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "flex-start"; 
        button.style.width = "200px"; 
        button.style.height = "50px"; 
        button.style.marginBottom = "10px";

        button.addEventListener("click", () => pobierzDane(pokemon.name));
        
        detailsElement.appendChild(button); 
    });
}



listaPokemonow();
