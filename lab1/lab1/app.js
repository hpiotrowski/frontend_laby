
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
    } finally {
  
    }
}
function displayPokemona(pokemon) {
    const detailsElement = document.getElementById("pokemonDetails");
    detailsElement.innerHTML = `
        <h3>${pokemon.name.toUpperCase()}</h3>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Waga: ${pokemon.weight}</p>
        <p>Wzrost: ${pokemon.height}</p>
        <p>Typy: ${pokemon.types.map(typy => typy.type.name).join(", ")}</p>
    `;
}

function displayErrorMessage(message) {
    const detailsElement = document.getElementById("pokemonDetails");
    detailsElement.innerHTML = `<p style="color: red;">${message}</p>`;
}

document.getElementById("searchButton").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
        pobierzDane(searchInput);
    } else {
        displayErrorMessage("Wpisz nazwe");
    }
});