const PokemonSearch = () => {
  let searchQuery = '';

  const handleSearchChange = (event) => {
      searchQuery = event.target.value;
  };

  const handleSearch = () => {
      if (searchQuery) {
          window.pobierzDane(searchQuery);
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