import { FC, useEffect, useState } from 'react'
import { BookmarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Movie } from '../../interfaces/interfaces'
import { auth } from '../../firebase'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { fetchUser, updateUser } from '../../api/user_api'
import { User } from '../../models/user'
import Lottie from 'lottie-react'
import images from "../../assets"


interface AddToWatchListProps {
    movie: Movie
    type: string
}

const AddToWatchList: FC<AddToWatchListProps> = (props) => {

    const [userFavorites, setUserFavorites] = useState<string[]>();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userDocument, setUserDocument] = useState<User | null>(null)
    const [isLoading, setLoading] = useState(false);
    const { movie, type } = props
    const mediaType = movie.title ? "movie" : "tv"
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                if (!user) {
                    return
                } else {
                    const userDocument = await fetchUser(user.uid)
                    setUserDocument(userDocument)
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userDocument) {
            setUserFavorites(userDocument.favorites);
        }
    }, [userDocument]);

    const addToFavorites = async (movieId: string, mediaType: string) => {
        setLoading(true);

        const updatedFavorites = [...userDocument!.favorites];

        if (updatedFavorites.includes(`${movieId} ${mediaType}`)) {
            const index = updatedFavorites.indexOf(`${movieId} ${mediaType}`);
            updatedFavorites.splice(index, 1);
        } else {
            updatedFavorites.push(`${movieId} ${mediaType}`);
        }

        try {
            const updatedUser = await updateUser({
                ...userDocument!,
                favorites: updatedFavorites,
            });

            setUserDocument(updatedUser);
            setUserFavorites(updatedUser.favorites);
            console.log(updatedFavorites);
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setLoading(false)
        }
    }

    if (!userFavorites) {
        return <div>
            {type === "button" ? (
                <button onClick={() => navigate('/login')} className='flex flex-row gap-2 justify-center items-center px-5 py-3 bg-bg-color text-text-color rounded-2xl font-bold text-xs sm:max-4xl:text-lg transition-all hover:bg-text-color hover:text-bg-color'>
                    Add to Watch List
                    <BookmarkIcon className='sm:max-4xl:w-6 sm:max-4xl:h-6 w-4 h-4' />
                </button>
            ) : (
                <span className="text-gradient">
                    <svg onClick={() => navigate('/login')} xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="cursor-pointer w-8 h-8">
                        <linearGradient id="gradient">
                            <stop className="main-stop" offset="0%" />
                            <stop className="alt-stop" offset="100%" />
                        </linearGradient>
                        <path stroke='url(#gradient)' strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </span>
            )}
        </div>
    }


    return (
        <div>
            {type === "button" ? (
                <button onClick={() => addToFavorites(movie.id.toString(), mediaType)} className='flex flex-row gap-2 justify-center items-center px-5 py-3 bg-bg-color text-text-color rounded-2xl font-bold text-xs sm:max-4xl:text-lg transition-all hover:bg-text-color hover:text-bg-color'>
                    {!userFavorites.includes(`${movie.id} ${mediaType}`) ? (
                        <>
                            {isLoading ? <Lottie animationData={images.loading} className='w-4' /> :
                                <>
                                    Add to Watch List
                                    <BookmarkIcon className='sm:max-4xl:w-6 sm:max-4xl:h-6 w-4 h-4' />
                                </>
                            }
                        </>
                    ) : (
                        <>
                            {isLoading ? <Lottie animationData={images.loading} className='w-4' /> :
                                <>
                                    In your Watch List
                                    <CheckCircleIcon className='sm:max-4xl:w-6 sm:max-4xl:h-6 w-4 h-4' />
                                </>
                            }
                        </>
                    )}
                </button>
            ) : (
                <>
                    <span className="text-gradient">
                        {!userFavorites.includes(`${movie.id} ${mediaType}`) ? (
                            <>
                                <svg onClick={() => addToFavorites(movie.id.toString(), mediaType)} xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="cursor-pointer w-8 h-8">
                                    <linearGradient id="gradient">
                                        <stop className="main-stop" offset="0%" />
                                        <stop className="alt-stop" offset="100%" />
                                    </linearGradient>
                                    <path stroke='url(#gradient)' strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                            </>
                        ) : (
                            <>
                                <svg onClick={() => addToFavorites(movie.id.toString(), mediaType)} xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" className="slide-in-fwd-center cursor-pointer w-8 h-8">
                                    <linearGradient id="gradient">
                                        <stop className="main-stop" offset="0%" />
                                        <stop className="alt-stop" offset="100%" />
                                    </linearGradient>
                                    <path stroke='url(#gradient)' fill='url(#gradient)' strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                            </>
                        )}
                    </span>
                </>
            )
            }
        </div >
    )
}

export { AddToWatchList };