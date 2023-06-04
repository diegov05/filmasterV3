import { FC, useContext, useEffect, useState } from 'react';
import { Movie } from '../../interfaces/interfaces';
import { User } from '../../models/user';
import { key } from '../../tmdbRequests';
import { AddToWatchList, Loading, NavBar, SearchBar } from '../../components';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import images from "../../assets";
import axios from "axios";
import { useUserDocument } from '../../hooks/useUserDocument';

interface HeaderProps {
    handleMenuToggle: () => void
}

const Header: FC<HeaderProps> = (props) => {

    const [movie, setMovie] = useState<Movie | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const [isSearchToggled, setIsSearchToggled] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [userDocument, setUserDocument] = useState<User | null>(null);


    const user = useContext(AuthContext)
    const navigate = useNavigate()
    const mediaType = movie?.title ? "movie" : "tv"

    const { handleMenuToggle } = props

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${key}&without_genres=27,14`
                );
                const data = response.data

                const randomIndex = Math.floor(Math.random() * data.results.length);
                const randomMovieId = data.results[randomIndex].id;

                const movieResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${randomMovieId}?api_key=${key}`
                );
                const movieData = movieResponse.data
                setMovie(movieData)
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userDocument = useUserDocument(user)
                setUserDocument(userDocument)
            } else {
            }
        });
        return () => unsubscribe();
    }, []);

    const handleToggleMenu = () => {
        if (isMenuVisible) {
            setIsMenuToggled(false)
            handleMenuToggle()
            setTimeout(() => {
                setIsMenuVisible(false)
            }, 500)
            return
        }
        handleMenuToggle()
        setIsMenuToggled(true)
        setIsMenuVisible(true)
    }

    const handleToggleSearch = () => {
        if (isSearching) {
            setIsSearchToggled(false)
            setTimeout(() => {
                setIsSearching(false)
            }, 500)
            return
        }
        setIsSearchToggled(true)
        setIsSearching(true)
    }

    if (!movie) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <Loading />
            </div>
        )
    }

    return (
        <div className='slide-in-fwd-center'>
            <div className='absolute bg-gradient-to-tr from-black flex flex-col justify-between w-full h-full p-10' />
            {isMenuVisible &&
                <div className={`sm:max-4xl:hidden slide-in-top ${!isMenuToggled ? "slide-out-top" : ""} absolute z-50 w-screen h-screen bg-zinc-800 flex flex-col gap-20 p-10`}>
                    <img className='absolute -z-10 -top-36 -left-48' src={images.gradient} alt="" />
                    <div className='flex flex-row justify-between items-center'>
                        <div className='w-max'>
                            <h1 className='w-max font-bold text-2xl pb-4 text-bg-color'>Menu</h1>
                            <div className='w-20 h-1 bg-gradient' />
                        </div>
                        <button onClick={handleToggleMenu} className='sm:max-4xl:hidden bg-bg-color p-2 h-min rounded-xl flex flex-col justify-center items-center'>
                            <XMarkIcon className='w-4 h-4 text-text-color' />
                        </button>
                    </div>
                    <div className='flex flex-col justify-center items-start gap-10'>
                        <button onClick={handleToggleSearch} className='w-full'>
                            <h1 className='w-max font-bold text-xl pb-4 text-bg-color'>Search</h1>
                            <div className='h-0.5 bg-zinc-700' />
                        </button>
                        {user && (
                            <>
                                <button onClick={() => {
                                    signOut(auth)
                                    navigate('/login')
                                }} className='w-full'>
                                    <div className='flex flex-row justify-start items-center gap-2'>
                                        {/* <img className='w-10 h-10 pb-4' src={userDocument?.avatar} alt={userDocument?.username} /> */}
                                        <h1 className='w-max font-bold text-xl pb-4 text-bg-color'>Sign Out</h1>
                                    </div>
                                    <div className='h-0.5 bg-zinc-700' />
                                </button>
                                <div className='w-max'>
                                    <h1 className='w-[25ch] xs:max-4xl:w-max font-light text-base pb-4 text-zinc-500'>Logged In As: {userDocument?.username}</h1>
                                    <div className='h-0.5 bg-zinc-700' />
                                </div>
                            </>
                        )}
                        {!user &&
                            <>
                                <button onClick={() => navigate('/login')} className='w-full'>
                                    <h1 className='w-max font-bold text-xl pb-4 text-bg-color'>Sign In</h1>
                                    <div className='h-0.5 bg-zinc-700' />
                                </button>
                                <button onClick={() => { navigate('/register') }} className='w-full'>
                                    <h1 className='w-max font-bold text-xl pb-4 text-bg-color'>Register</h1>
                                    <div className='h-0.5 bg-zinc-700' />
                                </button>
                            </>
                        }
                        <img className='w-24' src={images.logoWhite} alt="" />
                    </div>
                </div>
            }
            {isSearching && (
                <div className={`sm:max-4xl:hidden slide-in-bottom ${!isSearchToggled ? "slide-out-bottom" : ""} absolute z-50 w-screen h-screen bg-bg-color flex flex-col gap-20 p-10`}>
                    <img className='absolute -z-10 -top-36 -left-48' src={images.gradient} alt="" />
                    <div className='flex flex-row justify-between items-center'>
                        <div className='w-max'>
                            <h1 className='w-max font-bold text-2xl pb-4 text-text-color'>Search</h1>
                            <div className='w-20 h-1 bg-gradient' />
                        </div>
                        <button onClick={handleToggleSearch} className='sm:max-4xl:hidden bg-bg-color p-2 h-min rounded-xl flex flex-col justify-center items-center'>
                            <XMarkIcon className='w-4 h-4 text-text-color' />
                        </button>
                    </div>
                    <SearchBar />
                </div>
            )}
            <div className='absolute flex flex-col justify-between w-full h-full p-10'>
                <div className='flex flew-row w-full justify-between'>
                    <NavBar />
                    <button onClick={handleToggleMenu} className='sm:max-4xl:hidden bg-bg-color p-2 rounded-xl flex flex-col justify-center items-center'>
                        <Bars3Icon className='w-4 h-4 text-text-color' />
                    </button>
                </div>
                <div className='flex flex-col gap-6'>
                    <div>
                        <h1 className='font-black text-2xl xs:max-sm:text-3xl sm:max-4xl:text-5xl text-bg-color'>{movie.title}</h1>
                    </div>
                    <div className='flex-col items-start flex xs:max-4xl:flex-row gap-4 justify-start xs:max-4xl:items-center'>
                        <button onClick={() => navigate(`/movie/${movie.id}?mediatype=${mediaType}`)} className='flex flex-row gap-2 justify-center items-center px-5 py-3 bg-button-primary-color text-bg-color rounded-2xl font-bold text-xs sm:max-4xl:text-lg transition-all hover:bg-accent-color hover:text-text-color'>
                            Watch
                            <VideoCameraIcon className='sm:max-4xl:w-6 sm:max-4xl:h-6 w-4 h-4' />
                        </button>
                        <AddToWatchList movie={movie} type='button' />
                    </div>
                </div>
            </div>
            <img className='w-full h-[70vh] object-cover' src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} />
        </div>
    )
}

export { Header };