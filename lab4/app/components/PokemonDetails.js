'use client';
import React, { useState, useEffect } from 'react';
import TrainingNoteForm from './TrainingNoteForm';
import TrainingNoteEdit from './TrainingNoteEdit';

const PokemonDetails = ({ pokemon, onBack }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showAddNote, setShowAddNote] = useState(false);
    const [showEditNote, setShowEditNote] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [trainingNotes, setTrainingNotes] = useState([]);

    useEffect(() => {
        if (!pokemon) return;
        
        // Load favorites
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        setIsFavorite(favoriteIds.includes(pokemon.id));
        
        // Load training notes
        const allNotes = JSON.parse(localStorage.getItem('trainingNotes')) || [];
        const pokemonNotes = allNotes
            .filter(note => note.pokemonId === pokemon.id)
            .sort((a, b) => new Date(b.trainingDate) - new Date(a.trainingDate));
        setTrainingNotes(pokemonNotes);
    }, [pokemon]);

    const addToFavorites = () => {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        if (!favoriteIds.includes(pokemon.id)) {
            favoriteIds.push(pokemon.id);
            localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds));
            setIsFavorite(true);
        }
    };

    const removeFromFavorites = () => {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
        const newFavoriteIds = favoriteIds.filter(id => id !== pokemon.id);
        localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));
        setIsFavorite(false);
    };

    const handleAddNote = (note) => {
        setTrainingNotes(prev => [note, ...prev]);
        setShowAddNote(false);
    };

    const handleEditNote = (note) => {
        setTrainingNotes(prev => 
            prev.map(n => n.id === note.id ? note : n)
        );
        setShowEditNote(false);
        setSelectedNote(null);
    };

    const handleDeleteNote = (noteId) => {
        const confirmed = window.confirm('Czy na pewno chcesz usunąć tę notatkę?');
        if (!confirmed) return;

        const existingNotes = JSON.parse(localStorage.getItem('trainingNotes') || '[]');
        const updatedNotes = existingNotes.filter(note => note.id !== noteId);
        localStorage.setItem('trainingNotes', JSON.stringify(updatedNotes));
        
        setTrainingNotes(prev => prev.filter(note => note.id !== noteId));
    };

    if (!pokemon) return <div>Brak danych o pokemonie</div>;

    return (
        <div id="pokemonDetails">
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <div className="pokemon-stats">
                <p><strong>Waga:</strong> {(pokemon.weight / 10).toFixed(1)} kg</p>
                <p><strong>Wzrost:</strong> {(pokemon.height / 10).toFixed(1)} m</p>
                {pokemon.stats && (
                    <div className="stats-grid">
                        <p><strong>HP:</strong> {pokemon.stats.hp}</p>
                        <p><strong>Atak:</strong> {pokemon.stats.attack}</p>
                        <p><strong>Obrona:</strong> {pokemon.stats.defense}</p>
                        <p><strong>Sp. Atak:</strong> {pokemon.stats.specialAttack}</p>
                        <p><strong>Sp. Obrona:</strong> {pokemon.stats.specialDefense}</p>
                        <p><strong>Szybkość:</strong> {pokemon.stats.speed}</p>
                    </div>
                )}
            </div>
            <div className="pokemon-types">
                {pokemon.types.map((type, index) => (
                    <span key={index} className={`pokemon-type type-${type}`}>
                        {type}
                    </span>
                ))}
            </div>
            <div className="buttons-container">
                {!isFavorite ? (
                    <button onClick={addToFavorites}>Dodaj do ulubionych</button>
                ) : (
                    <button onClick={removeFromFavorites}>Usuń z ulubionych</button>
                )}
                <button onClick={onBack}>Wróć do listy</button>
            </div>
            <div className="training-notes-section">
                <button onClick={() => setShowAddNote(true)}>
                    Dodaj notatkę treningową
                </button>
                
                {showAddNote && (
                    <div className="modal">
                        <TrainingNoteForm
                            pokemonId={pokemon.id}
                            onSubmit={handleAddNote}
                            onClose={() => setShowAddNote(false)}
                        />
                    </div>
                )}
                
                {showEditNote && selectedNote && (
                    <div className="modal">
                        <TrainingNoteEdit
                            note={selectedNote}
                            onSubmit={handleEditNote}
                            onClose={() => {
                                setShowEditNote(false);
                                setSelectedNote(null);
                            }}
                        />
                    </div>
                )}
                
                <div className="notes-list">
                    {trainingNotes.map(note => (
                        <div key={note.id} className="note-card">
                            <h4>{note.tacticName}</h4>
                            <p>{note.strategy}</p>
                            <p>Skuteczność: {note.effectiveness}/5</p>
                            <p>Data treningu: {new Date(note.trainingDate).toLocaleDateString()}</p>
                            <div className="note-actions">
                                <button onClick={() => {
                                    setSelectedNote(note);
                                    setShowEditNote(true);
                                }}>
                                    Edytuj
                                </button>
                                <button onClick={() => handleDeleteNote(note.id)}>
                                    Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PokemonDetails;
