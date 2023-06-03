import { FC, useEffect, useState } from 'react'
import { Loading } from '../../components'

interface TrailerProps {
    trailerKey: string | null
}

const Trailer: FC<TrailerProps> = (props) => {

    const [trailerKey, setTrailerKey] = useState<string | null>(null)

    useEffect(() => {
        const { trailerKey } = props
        setTrailerKey(trailerKey)
    }, [trailerKey, props])

    if (!trailerKey) {
        return <div className='w-full h-screen flex flex-col justify-center items-center'>
            <Loading />
        </div>
    }

    return (
        <div className='pr-10 flex flex-col gap-8'>
            <div className='w-max'>
                <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Trailer</h1>
                <div className='w-full h-1 bg-gradient' />
            </div>
            {trailerKey && (
                <iframe
                    className='rounded-2xl'
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Trailer"
                    allowFullScreen
                />
            )}
        </div>
    )
}

export { Trailer };