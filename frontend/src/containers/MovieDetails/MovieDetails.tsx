import { FC } from 'react';
import { VideoCameraIcon, CalendarDaysIcon, FilmIcon } from '@heroicons/react/24/outline';
import { Movie } from '../../interfaces/interfaces';

interface MovieDetailsProps {
    movie: Movie
}

const MovieDetails: FC<MovieDetailsProps> = (props) => {

    const { movie } = props

    return (
        <div className='pr-10 flex flex-col gap-2 md:max-4xl:gap-4 justify-start items-start'>
            <div className='flex flex-row gap-4 justify-start items-center'>
                <span className="text-gradient">
                    <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 sm:max-4xl:w-6 sm:max-4xl:h-6">
                        <linearGradient id="gradient">
                            <stop className="main-stop" offset="0%" />
                            <stop className="alt-stop" offset="100%" />
                        </linearGradient>
                        <path stroke='url(#gradient)' strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </span>
                <p className='font-bold text-xs sm:max-4xl:text-base text-text-color/50'>
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
            <div className='flex flex-row gap-4 justify-start items-center'>
                <VideoCameraIcon className='h-3 w-3 sm:max-4xl:w-5 sm:max-4xl:h-5 text-text-color' />
                <p className='font-bold text-xs sm:max-4xl:text-base text-text-color/50'>
                    {movie.runtime ? `${movie.runtime} min.` : `${movie.episode_run_time} min.`}
                </p>
            </div>
            <div className='flex flex-row gap-4 justify-start items-center'>
                <CalendarDaysIcon className='h-3 w-3 sm:max-4xl:w-5 sm:max-4xl:h-5 text-text-color' />
                <p className='font-bold text-xs sm:max-4xl:text-base text-text-color/50'>
                    {movie.release_date ? movie.release_date.slice(0, 4) : movie.first_air_date.slice(0, 4)}
                </p>
            </div>
            <div className='flex flex-row gap-4 justify-start items-center'>
                <FilmIcon className='h-3 w-3 sm:max-4xl:w-5 sm:max-4xl:h-5 text-text-color' />
                <div className='flex flex-row gap-2 font-bold text-xs sm:max-4xl:text-base text-text-color/50'>
                    {movie.genres.map((genre) => (
                        <p key={genre.id} className='font-bold text-xs sm:max-4xl:text-base text-text-color/50'>
                            {genre.name}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { MovieDetails };