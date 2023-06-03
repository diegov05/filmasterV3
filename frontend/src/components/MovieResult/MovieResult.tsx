import { FC } from 'react'
import { Movie } from '../../interfaces/interfaces'
import { useNavigate } from 'react-router-dom'
import "./MovieResult.css"

interface MovieResultProps {
    movie: Movie
    mediaType: string
    handleToggleMenu?: () => void
    handleToggleSearch?: () => void
}

const MovieResult: FC<MovieResultProps> = (props) => {

    const navigate = useNavigate()
    const movie = props.movie
    const mediaType = props.mediaType

    return (
        <div onClick={() => {
            props.handleToggleMenu ? props.handleToggleMenu() : ""
            props.handleToggleSearch ? props.handleToggleSearch() : ""
            navigate(`/movie/${movie.id}?mediatype=${mediaType}`)
        }
        } className='transition-all hover:cursor-pointer hover:opacity-80 flex flex-row px-5 py-3 justify-start gap-4 border-b border-zinc-300 items-start'>
            <img className='w-20' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title ? movie.title : movie.name} />
            <div className='flex flex-col gap-1'>
                <span className='font-bold'>{movie.title ? movie.title : movie.name}</span>
                <span className='text-xs text-zinc-400 font-bold'>{movie.release_date ? movie.release_date.slice(0, 4) : movie.first_air_date ? movie.first_air_date.slice(0, 4) : ""}</span>
                <div className='flex flex-row justify-start items-end gap-1'>
                    <span className="text-gradient">
                        <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <linearGradient id="gradient">
                                <stop className="main-stop" offset="0%" />
                                <stop className="alt-stop" offset="100%" />
                            </linearGradient>
                            <path stroke='url(#gradient)' strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                    </span>
                    <p className='font-bold text-xs text-text-color/50'>
                        {movie.vote_average.toFixed(1)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export { MovieResult };