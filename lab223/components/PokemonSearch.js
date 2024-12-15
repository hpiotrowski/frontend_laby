const PokemonSearch = () => {
    let searchQuery = '';

    const zapiszWartosc = (event) => {
        searchQuery = event.target.value;
    };

    const wyszukaj = () => {
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
                onChange={zapiszWartosc}
            />
            <button onClick={wyszukaj}>Szukaj</button>
        </div>
    );
};