import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

const validationSchema = Yup.object({
  tacticName: Yup.string()
    .min(5, 'Nazwa musi mieć co najmniej 5 znaków')
    .max(50, 'Nazwa nie może przekraczać 50 znaków')
    .required('Nazwa jest wymagana'),
  strategy: Yup.string()
    .min(10, 'Opis strategii musi mieć co najmniej 10 znaków')
    .required('Opis strategii jest wymagany'),
  effectiveness: Yup.number()
    .min(1, 'Wybierz skuteczność')
    .max(5, 'Wybierz skuteczność')
    .required('Skuteczność jest wymagana'),
  conditions: Yup.string()
    .min(10, 'Warunki użycia muszą mieć co najmniej 10 znaków')
    .required('Warunki użycia są wymagane'),
  trainingDate: Yup.date()
    .required('Data treningu jest wymagana'),
  opponents: Yup.array()
    .min(1, 'Wybierz co najmniej jeden typ przeciwnika')
});

const TrainingNoteForm = ({ pokemonId, onSubmit, onClose }) => {
  const initialValues = {
    tacticName: '',
    strategy: '',
    effectiveness: '',
    conditions: '',
    trainingDate: new Date().toISOString().split('T')[0],
    opponents: []
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const note = {
      id: uuidv4(),
      pokemonId,
      ...values,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingNotes = JSON.parse(localStorage.getItem('trainingNotes') || '[]');
    localStorage.setItem('trainingNotes', JSON.stringify([...existingNotes, note]));
    
    onSubmit(note);
    setSubmitting(false);
    onClose();
  };

  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="training-note-form">
          <div className="form-group">
            <label htmlFor="tacticName">Nazwa taktyki</label>
            <Field type="text" name="tacticName" />
            <ErrorMessage name="tacticName" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="strategy">Opis strategii</label>
            <Field as="textarea" name="strategy" />
            <ErrorMessage name="strategy" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="effectiveness">Skuteczność</label>
            <Field as="select" name="effectiveness">
              <option value="">Wybierz skuteczność</option>
              {[1, 2, 3, 4, 5].map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </Field>
            <ErrorMessage name="effectiveness" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="conditions">Warunki użycia</label>
            <Field as="textarea" name="conditions" />
            <ErrorMessage name="conditions" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="trainingDate">Data treningu</label>
            <Field type="date" name="trainingDate" />
            <ErrorMessage name="trainingDate" component="div" className="error" />
          </div>

          <div className="form-group">
            <label>Przeciwnicy</label>
            <div className="types-grid">
              {pokemonTypes.map(type => (
                <label key={type} className="type-checkbox">
                  <Field type="checkbox" name="opponents" value={type} />
                  {type}
                </label>
              ))}
            </div>
            <ErrorMessage name="opponents" component="div" className="error" />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz notatkę'}
            </button>
            <button type="button" onClick={onClose}>Anuluj</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TrainingNoteForm; 