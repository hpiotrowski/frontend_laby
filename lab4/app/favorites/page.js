'use client';
import FavoritesList from '../components/FavoritesList';
import Link from 'next/link';

export default function FavoritesPage() {
    return (
        <div>
            <h1>Ulubione Pokemony</h1>
            <FavoritesList />
            <Link href="/pokemon">Wróć do listy pokemonów</Link>
        </div>
    );
}