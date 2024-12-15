import PokemonDetail from '@/components/PokemonDetail';

export default function PokemonDetailPage({ params }) {
  const { id } = params; // id Pokemona

  return (
    <div>
      <h1>Szczegóły Pokemona {id}</h1>
      <PokemonDetail id={id} />
    </div>
  );
}