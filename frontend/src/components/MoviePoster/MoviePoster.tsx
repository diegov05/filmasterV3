import { FC, useState } from 'react';
import { Movie } from '../../interfaces/interfaces';
import { AddToWatchList } from '../AddToWatchList/AddToWatchList';
import { useNavigate } from 'react-router-dom';

interface MoviePosterProps {
    movie: Movie
}

const MoviePoster: FC<MoviePosterProps> = (props) => {

    const movie = props.movie
    const navigate = useNavigate()
    const mediaType = movie.title ? "movie" : "tv"

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isShowing, setIsShowing] = useState<boolean>(false);

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
        <div onMouseEnter={handleToggleOverlay} onMouseLeave={handleToggleOverlay} className='disable-selection slide-in-fwd-center cursor-pointer w-48 md:max-4xl:w-64 h-full'>
            {isShowing &&
                <>
                    <div className={`flex flex-col justify-start items-start p-4 absolute z-50 slide-in-fwd-center ${!isFocused ? "slide-out-bck-center" : ""}`}>
                        <AddToWatchList movie={movie} type='star' />
                    </div>
                    <div onClick={() => navigate(`/movie/${movie.id}?mediatype=${mediaType}`)} className={`flex flex-col justify-start items-start p-4 absolute slide-in-fwd-center ${!isFocused ? "slide-out-bck-center" : ""} w-48 md:max-4xl:w-64 bg-gradient-to-b from-black/40 h-72 md:max-4xl:h-96 rounded-2xl gap-2 `}>
                    </div>
                </>}
            <img className='transition-all duration-500 w-48 md:max-4xl:w-64 rounded-2xl shadow-lg shadow-zinc-600' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
        </div>
    )
}

export { MoviePoster };