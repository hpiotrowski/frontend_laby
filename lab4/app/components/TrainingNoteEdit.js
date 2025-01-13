import { useState, useEffect } from 'react';

const TrainingNoteEdit = ({ note, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    tacticName: '',
    strategy: '',
    effectiveness: '',
    conditions: '',
    trainingDate: '',
    opponents: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (note) {
      setFormData({
        tacticName: note.tacticName,
        strategy: note.strategy,
        effectiveness: note.effectiveness,
        conditions: note.conditions,
        trainingDate: note.trainingDate,
        opponents: note.opponents
      });
    }
  }, [note]);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.tacticName.length < 5 || formData.tacticName.length > 50) {
      newErrors.tacticName = 'Nazwa musi mieć od 5 do 50 znaków';
    }
    
    if (formData.strategy.length < 10) {
      newErrors.strategy = 'Opis strategii musi mieć co najmniej 10 znaków';
    }
    
    if (!formData.effectiveness) {
      newErrors.effectiveness = 'Wybierz skuteczność';
    }
    
    if (formData.conditions.length < 10) {
      newErrors.conditions = 'Warunki użycia muszą mieć co najmniej 10 znaków';
    }
    
    if (!formData.trainingDate) {
      newErrors.trainingDate = 'Data treningu jest wymagana';
    }
    
    if (formData.opponents.length === 0) {
      newErrors.opponents = 'Wybierz co najmniej jeden typ przeciwnika';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedNote = {
        ...note,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      const existingNotes = JSON.parse(localStorage.getItem('trainingNotes') || '[]');
      const updatedNotes = existingNotes.map(n => 
        n.id === note.id ? updatedNote : n
      );
      
      localStorage.setItem('trainingNotes', JSON.stringify(updatedNotes));
      onSubmit(updatedNote);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedOpponents = checked
        ? [...formData.opponents, value]
        : formData.opponents.filter(type => type !== value);
      
      setFormData(prev => ({
        ...prev,
        opponents: updatedOpponents
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  return (
    <form onSubmit={handleSubmit} className="training-note-form">
      <div className="form-group">
        <label htmlFor="tacticName">Nazwa taktyki</label>
        <input
          type="text"
          name="tacticName"
          value={formData.tacticName}
          onChange={handleChange}
        />
        {errors.tacticName && <div className="error">{errors.tacticName}</div>}
      </div>

      {/* Similar structure for other fields */}
      
      <div className="form-buttons">
        <button type="submit">Zapisz zmiany</button>
        <button type="button" onClick={onClose}>Anuluj</button>
      </div>
    </form>
  );
};

export default TrainingNoteEdit; 