const ErrorMessage = ({ message, onBack }) => {
    return (
        <div>
            <p style={{ color: 'red' }}>{message}</p>
            <button onClick={onBack}>Wróć do listy</button>
        </div>
    );
};