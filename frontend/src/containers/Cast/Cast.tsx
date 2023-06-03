import { FC, useEffect, useRef, useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Movie } from '../../interfaces/interfaces';

interface CastProps {
    movie: Movie
}

const Cast: FC<CastProps> = (props) => {

    const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { movie } = props

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            setShowLeftButton(container.scrollLeft > 0);
        }
    };

    const handleLeftClick = () => {
        containerRef.current?.scrollBy({
            left: -300,
            behavior: "smooth",
        });
    };

    const handleRightClick = () => {
        containerRef.current?.scrollBy({
            left: 300,
            behavior: "smooth",
        });
    };

    return (
        <div className='sm:max-4xl:pr-10 flex flex-col gap-8'>
            <div className='slide-in-fwd-center flex flex-col gap-4 s:max-md:gap-8 md:max-4xl:gap-16'>
                <div className='w-max'>
                    <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Cast</h1>
                    <div className='w-full h-1 bg-gradient' />
                </div>
                <div className='flex flex-row justify-between items-center'>
                    {showLeftButton && (
                        <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleLeftClick}>
                            <ChevronLeftIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                        </button>
                    )}
                    <div ref={containerRef} className=" no-scrollbar relative flex flex-row items-center justify-between overflow-x-auto">
                        <div className="flex flex-col items-start">
                            <div className="flex overflow-x-visible gap-4 sm:max-4xl:gap-12 pb-10">
                                {movie.credits.cast.map((castMember) => (
                                    <div key={castMember.id} className='disable-selection relative w-48 md:max-4xl:w-64 h-full flex flex-col justify-between items-start rounded-2xl shadow-lg shadow-zinc-600'>
                                        <img className='w-48 md:max-4xl:w-64 rounded-2xl' src={`https://image.tmdb.org/t/p/original${castMember.profile_path}`} alt="" />
                                        <div className='absolute bottom-0 w-full flex flex-col gap-2 bg-bg-color px-5 py-3 rounded-b-2xl'>
                                            <div>
                                                <h1 className='text-text-color font-bold text-xs sm:max-4xl:text-base'>{castMember.name}</h1>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleRightClick}>
                        <ChevronRightIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export { Cast };