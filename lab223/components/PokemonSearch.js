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