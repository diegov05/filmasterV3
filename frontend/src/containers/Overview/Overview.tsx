import { FC } from 'react'
import { Movie } from '../../interfaces/interfaces';

interface OverviewProps {
    movie: Movie
}

const Overview: FC<OverviewProps> = (props) => {

    const { movie } = props

    return (
        <div className='pr-10 flex flex-col gap-8'>
            <div className='w-max'>
                <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Overview</h1>
                <div className='w-full h-1 bg-gradient' />
            </div>
            <p className='text-xs xs:max-sm:text-sm sm:max-4xl:text-2xl'>{movie.overview}</p>
        </div>
    )
}

export { Overview };