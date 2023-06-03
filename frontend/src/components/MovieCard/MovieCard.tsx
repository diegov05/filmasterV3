import { FC, useState } from 'react';
import { Movie } from '../../interfaces/interfaces';
import { VideoCameraIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { AddToWatchList } from '../AddToWatchList/AddToWatchList';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
    movie: Movie
}

const MovieCard: FC<MovieCardProps> = (props) => {

    const { movie } = props
    const mediaType = movie?.title ? "movie" : "tv"
    const navigate = useNavigate()

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isShowing, setIsShowing] = useState<boolean>(false);
    const [isInfoShowing, setIsInfoShowing] = useState<boolean>(false);

    const handleToggleOverlay = () => {
        if (isShowing) {
            setIsFocused(false)
            setTimeout(() => {
                setIsShowing(false)
            }, 500)
            return
        }
        setIsFocused(true)
        setIsShowing(true)
    }

    return (
        <div onMouseEnter={handleToggleOverlay} onMouseLeave={handleToggleOverlay} className='disable-selection relative w-48 md:max-4xl:w-64 h-full flex flex-col justify-between items-start rounded-2xl shadow-lg shadow-zinc-600'>
            {isShowing && <div className={`flex flex-col justify-start items-start p-4 absolute slide-in-fwd-center ${!isFocused ? "slide-out-bck-center" : ""} w-48 md:max-4xl:w-64 bg-gradient-to-b from-black/40 h-72 md:max-4xl:h-96 rounded-2xl gap-2 `}>
                <AddToWatchList movie={movie} type='star' />
            </div>}
            <img className='w-48 md:max-4xl:w-64 rounded-2xl' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
            <div className='absolute bottom-0 w-full flex flex-col gap-2 bg-bg-color px-5 py-3 rounded-b-2xl'>
                <div className='flex flex-row justify-start items-end gap-1'>
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
                <div>
                    <h1 className='text-text-color font-bold text-xs sm:max-4xl:text-base'>{movie.title}</h1>
                </div>
                <button onClick={() => navigate(`/movie/${movie.id}?mediatype=${mediaType}`)} className='bg-gradient cursor-pointer transition-all duration-300 hover:opacity-80 py-1 sm:max-4xl:py-2 pw-16 rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm text-bg-color'>Watch Options
                </button>
                <div className='flex flex-row gap-2 justify-start items-start'>
                    <button onClick={() => navigate(`/movie/${movie.id}?mediatype=${mediaType}`)} className='flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-[#E6E6E6] text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all hover:bg-accent-color hover:text-text-color'>
                        <VideoCameraIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                        Trailer
                    </button>
                    <button onClick={() => setIsInfoShowing(!isInfoShowing)} className='flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-[#ededed] text-text-color rounded-2xl font-bold text-sm transition-all hover:bg-accent-color hover:text-text-color'>
                        <InformationCircleIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                    </button>
                    {isInfoShowing && <div className='slide-in-fwd-center shadow-xl shadow-black/30 absolute left-12  bottom-16 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-[#ededed] text-text-color rounded-2xl font-bold text-[8px] md:max-4xl:text-xs transition-all'>
                        {movie.overview?.length! > 300 ? `${movie.overview?.slice(0, 300)} ...` : movie.overview}
                    </div>}
                </div>
            </div>
        </div >
    )
}

export { MovieCard };