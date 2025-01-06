'use client';
import React from 'react';

const ComparisonView = ({ pokemon1, pokemon2, onClear }) => {
    if (!pokemon1 || !pokemon2) return null;

    const renderStatComparison = (stat1, stat2, label) => {
        const getStatClass = (value1, value2) => {
            if (value1 > value2) return 'higher';
            if (value1 < value2) return 'lower';
            return 'equal';
        };

        return (
            <div className="stat-comparison">
                <span className={getStatClass(stat1, stat2)}>{stat1}</span>
                <span className="stat-label">{label}</span>
                <span className={getStatClass(stat2, stat1)}>{stat2}</span>
            </div>
        );
    };

    return (
        <div className="comparison-container">
            <h2>Porównanie Pokemonów</h2>
            <div className="comparison-layout">
                <div className="pokemon-compare-card">
                    <h3>{pokemon1.name}</h3>
                    <img src={pokemon1.sprite} alt={pokemon1.name} />
                    <div className="types">
                        {pokemon1.types.map((type, index) => (
                            <span key={index} className={`pokemon-type type-${type}`}>{type}</span>
                        ))}
                    </div>
                </div>

                <div className="stats-comparison">
                    {renderStatComparison(pokemon1.stats.hp, pokemon2.stats.hp, "HP")}
                    {renderStatComparison(pokemon1.stats.attack, pokemon2.stats.attack, "Atak")}
                    {renderStatComparison(pokemon1.stats.defense, pokemon2.stats.defense, "Obrona")}
                    {renderStatComparison(pokemon1.stats.specialAttack, pokemon2.stats.specialAttack, "Sp. Atak")}
                    {renderStatComparison(pokemon1.stats.specialDefense, pokemon2.stats.specialDefense, "Sp. Obrona")}
                    {renderStatComparison(pokemon1.stats.speed, pokemon2.stats.speed, "Szybkość")}
                    {renderStatComparison(pokemon1.weight / 10, pokemon2.weight / 10, "Waga (kg)")}
                    {renderStatComparison(pokemon1.height / 10, pokemon2.height / 10, "Wzrost (m)")}
                </div>

                <div className="pokemon-compare-card">
                    <h3>{pokemon2.name}</h3>
                    <img src={pokemon2.sprite} alt={pokemon2.name} />
                    <div className="types">
                        {pokemon2.types.map((type, index) => (
                            <span key={index} className={`pokemon-type type-${type}`}>{type}</span>
                        ))}
                    </div>
                </div>
            </div>

            <button onClick={onClear} className="clear-comparison">
                Zakończ porównywanie
            </button>
        </div>
    );
};

export default ComparisonView; 