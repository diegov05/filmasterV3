import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FC, useEffect, useState } from 'react'
import { auth } from '../../firebase'
import { User as FirestoreUser, onAuthStateChanged } from 'firebase/auth'
import { Movie } from '../../interfaces/interfaces'
import { Review } from '../../models/review'
import { User } from '../../models/user'
import { useUserDocument } from '../../hooks/useUserDocument'

interface ReviewingBoxProps {
    movie: Movie
    handleToggleReviewing: () => void
}

const ReviewingBox: FC<ReviewingBoxProps> = (props) => {

    const currentDate = new Date().toJSON().slice(0, 10);

    const { movie, handleToggleReviewing } = props

    const [rating, setRating] = useState(0);
    const [user, setUser] = useState<FirestoreUser | null>(null);
    const [userDocument, setUserDocument] = useState<User | null>(null);
    const [review, setReview] = useState<Review>(
        {
            _id: "",
            author: userDocument ? userDocument : {
                _id: "",
                avatar: "",
                createdAt: "",
                favorites: [],
                password: "",
                updatedAt: "",
                username: "",
                watchList: []
            },
            content: "",
            createdAt: currentDate,
            updatedAt: currentDate,
            dislikes: [],
            likes: [],
            rating: 0,
            showId: "",
            showType: ""
        }
    )

    const handleStarClick = (selectedRating: number) => {
        setRating(selectedRating);
    };

    const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault();

        // const form = e.target as HTMLFormElement;
        // const reviewContent = form.reviewContent.value;
        // const reviewRating = rating

        // const newReview = {
        //     reviewId: doc(reviewsCollectionRef).id,
        //     userId: user ? user.uid : "",
        //     userName: user ? user.email : "",
        //     date: review.date,
        //     movieId: review.movieId,
        //     mediaType: review.mediaType,
        //     avatar: userData!.avatar,
        //     reviewContent,
        //     reviewRating,
        // };

        // try {
        //     await setDoc(doc(reviewsCollectionRef, newReview.reviewId), newReview);
        //     console.log('Review added to Firestore successfully!');
        //     setRating(0);
        //     window.location.reload();
        // } catch (error) {
        //     console.error('Error adding review to Firestore:', error);
        // }

        // form.reviewContent.value = '';
        // form.reviewRating.value = '';
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                const userDocument = useUserDocument(user)
                setUserDocument(userDocument)
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className='slide-in-fwd-center flex flex-col justify-center items-center absolute bg-black/40 backdrop-blur-sm w-full h-full z-50'>
            <div className='w-3/4 h-full flex flex-col justify-center items-center'>
                <div className='flex flex-col justify-start items-start gap-4'>
                    <button onClick={handleToggleReviewing} className=' bg-white p-2 h-min rounded-xl flex flex-col justify-center items-center'>
                        <XMarkIcon className='w-4 h-4 text-text-color' />
                    </button>
                    <div className='shadow-xl z-50 flex flex-col justify-center items-start gap-8 shadow-black/40 rounded-2xl bg-bg-color p-6 xs:max-4xl:p-10'>
                        <div className='slide-in-fwd-center w-max'>
                            <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Post Review</h1>
                            <div className='slide-in-fwd-center w-full h-1 bg-gradient' />
                        </div>
                        <form onSubmit={handleReviewSubmit} className='flex flex-col gap-4' action="">
                            <div className='flex flex-row flex-wrap items-center justify-center max-w-full w-44 xs:w-52 md:max-4xl:w-full'>
                                {[...Array(10)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={`cursor-pointer transition-all ${index < rating ? 'text-amber-400 fill-amber-400' : ''
                                            } w-8`}
                                        onClick={() => handleStarClick(index + 1)}
                                    />
                                ))}
                            </div>
                            <textarea style={{ resize: 'none' }} className='max-w-full w-44 xs:w-52 md:max-4xl:w-full px-5 py-3 rounded-2xl' placeholder="Type a review..." name="reviewContent" id="reviewContent" cols={20} rows={10}>
                            </textarea>
                            <button type='submit' className='bg-gradient cursor-pointer transition-all duration-300 hover:opacity-80 py-3 sm:max-4xl:py-2 pw-16 rounded-2xl font-bold sm:max-4xl:text-sm text-bg-color'>Post Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ReviewingBox };