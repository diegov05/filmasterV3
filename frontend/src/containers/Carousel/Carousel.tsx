import { FC, useEffect, useRef, useState } from 'react';
import { Movie } from '../../interfaces/interfaces';
import { key, requests } from '../../tmdbRequests';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Loading, MovieCard, MoviePoster, FilterButton } from '../../components';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import images from "../../assets";
import "./Carousel.css";
import axios from 'axios';

interface CarouselProps {
    content: string;
}

const Carousel: FC<CarouselProps> = (props) => {
    const [shows, setShows] = useState<Movie[]>([]);
    const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
    const [userFavoriteMovies, setUserFavoriteMovies] = useState<Movie[]>([])
    const [user, setUser] = useState<User | null>(null);
    const [index, setIndex] = useState<number>(0)

    const content = props.content;

    const containerRef = useRef<HTMLDivElement>(null);

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

    const handleIndexChange = (index: number) => {
        switch (index) {
            case 0:
                setIndex(0)
                break;
            case 1:
                setIndex(1)
                break;
            case 2:
                setIndex(2)
                break;
        }
    }

    useEffect(() => {
        switch (content) {
            case "movies":
                axios.get(index === 0 ? requests.nowPlayingMovies : index === 1 ? requests.upcomingMoviesRequest : requests.popularMoviesRequest).then((response) => {
                    setShows(response.data.results);
                });
                break;
            case "series":
                axios.get(index === 0 ? requests.onAirSeriesRequest : index === 1 ? requests.popularSeriesRequest : requests.trendingSeriesRequest).then((response) => {
                    index === 2 ? setShows(response.data.results.filter((movie: Movie) => parseInt(movie.first_air_date.slice(0, 4)) >= 2017)) :
                        setShows(response.data.results);
                });
                break;
            case "whatToWatch":
                axios.get(requests.nowPlayingMovies).then((response) => {
                    setShows(response.data.results)
                })
                break;
            case "watchList":
                break;
        }
    }, [index]);

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                const userId = user.uid;
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    if (!shows) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <Loading />
            </div>
        );
    }

    return (
        <div className='pl-10 sm:max-4xl:pr-10'>
            <img className='absolute -z-10 top-[25rem] -left-60 opacity-40 rounded-2xl' src={images.gradient} />
            {content === "movies" && (
                <div className='slide-in-fwd-center flex flex-col gap-4 s:max-md:gap-8 md:max-4xl:gap-16'>
                    <div className='flex flex-row gap-8 md:max-4xl:justify-between items-center'>
                        <div className='w-max'>
                            <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Movies</h1>
                            <div className='w-full h-1 bg-gradient' />
                        </div>
                        <FilterButton handleIndexChange={handleIndexChange} />
                    </div>
                    <div className='flex flex-row justify-between items-center'>
                        {showLeftButton && (
                            <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleLeftClick}>
                                <ChevronLeftIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                            </button>
                        )}
                        <div ref={containerRef} className="no-scrollbar relative flex flex-row items-center justify-between overflow-x-auto">
                            <div className="flex flex-col items-start">
                                <div className="flex overflow-x-visible gap-4 sm:max-4xl:gap-12 pb-10">
                                    {shows.map((show) => (
                                        <MoviePoster key={show.id} movie={show} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleRightClick}>
                            <ChevronRightIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                        </button>
                    </div>
                </div>
            )}
            {content === "series" && (
                <div className='slide-in-fwd-center flex flex-col gap-4 s:max-md:gap-8 md:max-4xl:gap-16'>
                    <div className='flex flex-row gap-8 md:max-4xl:justify-between items-center'>
                        <div className='w-max'>
                            <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Series</h1>
                            <div className='w-full h-1 bg-gradient' />
                        </div>
                        <FilterButton handleIndexChange={handleIndexChange} />
                    </div>
                    <div className='flex flex-row justify-between items-center'>
                        {showLeftButton && (
                            <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleLeftClick}>
                                <ChevronLeftIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                            </button>
                        )}
                        <div ref={containerRef} className="no-scrollbar relative flex flex-row items-center justify-between overflow-x-auto">
                            <div className="flex flex-col items-start">
                                <div className="flex overflow-x-visible gap-4 sm:max-4xl:gap-12 pb-10">
                                    {shows.map((show) => (
                                        <MoviePoster key={show.id} movie={show} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleRightClick}>
                            <ChevronRightIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                        </button>
                    </div>
                </div>
            )}
            {content === "whatToWatch" && (
                <div className='slide-in-fwd-center flex flex-col gap-4 s:max-md:gap-8 md:max-4xl:gap-16'>
                    <div className='w-max'>
                        <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>What to Watch</h1>
                        <div className='w-full h-1 bg-gradient' />
                    </div>
                    <div className='flex flex-row justify-between items-center'>
                        {showLeftButton && (
                            <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleLeftClick}>
                                <ChevronLeftIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                            </button>
                        )}
                        <div ref={containerRef} className="no-scrollbar relative flex flex-row items-center justify-between overflow-x-auto">
                            <div className="flex flex-col items-start">
                                <div className="flex overflow-x-visible gap-4 sm:max-4xl:gap-12 pb-10">
                                    {shows.map((show) => (
                                        <MovieCard key={show.id} movie={show} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleRightClick}>
                            <ChevronRightIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                        </button>
                    </div>
                </div>
            )}
            {content === "watchList" && (
                <div className='slide-in-fwd-center flex flex-col gap-4 s:max-md:gap-8 md:max-4xl:gap-16'>
                    <div className='w-max'>
                        <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Watch List</h1>
                        <div className='w-full h-1 bg-gradient' />
                    </div>
                    <div className='flex flex-row justify-between items-center'>
                        {showLeftButton && (
                            <button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleLeftClick}>
                                <ChevronLeftIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                            </button>
                        )}
                        <div ref={containerRef} className="no-scrollbar relative flex flex-row items-center justify-between overflow-x-auto">
                            <div className="flex flex-col items-start">
                                <div className="flex overflow-x-visible gap-4 sm:max-4xl:gap-12 pb-10">
                                    {userFavoriteMovies.length === 0 ? <span className='slide-in-fwd-center w-full flex flex-col justify-start items-start font-bold h-96'>It's very lonely in here...<br /> <span className='font-normal text-sm'>Click on the star to add a movie to favorites!</span></span> : ""}
                                    {userFavoriteMovies.map((movie => (
                                        <div className='' key={movie.id}>
                                            <MoviePoster key={movie.id} movie={movie} />
                                        </div>
                                    )))
                                    }
                                </div>
                            </div>
                        </div>
                        {userFavoriteMovies.length ? (<button className="hidden lg:max-4xl:block px-2 py-1" onClick={handleRightClick}>
                            <ChevronRightIcon className="hidden sm:max-4xl:block w-8 h-8 text-text-color" />
                        </button>) : ""}
                    </div>
                </div>
            )}
        </div>
    );
};

export { Carousel };
