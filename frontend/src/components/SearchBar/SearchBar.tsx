import { FC, useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Movie } from '../../interfaces/interfaces';
import { key } from '../../requests';
import { MovieResult } from '../MovieResult/MovieResult';
import axios from 'axios';
import './SearchBar.css';

interface SearchBarProps {
    handleToggleMenu?: () => void
    handleToggleSearch?: () => void
}

const SearchBar: FC<SearchBarProps> = (props) => {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    async function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const query = event.target.value;
        setQuery(query);

        if (query.length > 0) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${query}`
            );

            const moviesAndSeries = response.data.results.filter(
                (result: any) => result.media_type === 'movie' || result.media_type === 'tv'
            );

            setResults(moviesAndSeries);
        } else {
            setResults([]);
        }
    }

    const handleFocus = () => {
        setIsFocused(!isFocused)
    }

    return (
        <div className='border border-zinc-300 sm:max-4xl:outline-none sm:max-4xl:border-none relative flex flex-col rounded-2xl'>
            <div className='flex flex-row'>
                <div className='px-5 py-3 text-xs rounded-l-2xl bg-bg-color border-r border-zinc-300'>
                    <MagnifyingGlassIcon className='w-4 h-4 text-text-color' />
                </div>
                <input type='search' className='w-full outline-none border-none flex flex-row justify-start items-center gap-4 bg-bg-color px-5 py-3 rounded-r-2xl text-xs' placeholder='Search for movies...' value={query} onChange={handleSearch} onFocus={handleFocus} />
            </div>
            {isFocused && <div ref={resultsRef} className='search-bar absolute w-full sm:max-4xl:w-96 max-h-[28rem] overflow-y-scroll right-0 bg-bg-color top-14 rounded-2xl border border-zinc-300 sm:max-4xl:border-none sm:max-4xl:outline-none'>
                {results.map((movie) => (
                    <MovieResult handleToggleMenu={props.handleToggleMenu} handleToggleSearch={props.handleToggleSearch} movie={movie} key={movie.id} mediaType={movie.media_type} />
                ))}
            </div>}
        </div>
    )
}

export { SearchBar };