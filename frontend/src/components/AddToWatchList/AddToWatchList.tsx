import { FC, useEffect, useState } from 'react'
import { BookmarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Movie } from '../../interfaces/interfaces'
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { auth } from '../../firebase'
import { User, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useUserDocument } from '../../hooks/useUserDocument'
import { fetchUser } from '../../api/user_api'

interface AddToWatchListProps {
    movie: Movie
    type: string
}

const AddToWatchList: FC<AddToWatchListProps> = (props) => {

    const [userFavorites, setUserFavorites] = useState<string[]>();
    const [user, setUser] = useState<User | null>(null);
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
                    setUserFavorites(userDocument?.favorites)
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const addToFavorites = (movieId: string, mediaType: string) => {

        // const userFavoritesRef = doc(collection(db, 'users'), user?.uid);

        // if (!userFavorites) {
        //     return <div>Favorites not fetched.</div>
        // }

        // if (userFavorites.includes(`${movieId} ${mediaType}`)) {
        //     updateDoc(userFavoritesRef, {
        //         favorites: arrayRemove(`${movieId} ${mediaType}`),
        //     });
        // } else {
        //     updateDoc(userFavoritesRef, {
        //         favorites: arrayUnion(`${movieId} ${mediaType}`),
        //     });
        // }
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
                            Add to Watch List
                            <BookmarkIcon className='sm:max-4xl:w-6 sm:max-4xl:h-6 w-4 h-4' />
                        </>
                    ) : (
                        <>
                            In your Watch List
                            <CheckCircleIcon className='sm:max-4xl:w-6 sm:max-4xl:h-6 w-4 h-4' />
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