import { FC, useEffect, useState } from 'react';
import { Movie } from '../../interfaces/interfaces';
import { Review } from '../../components';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

interface ReviewsProps {
    movie: Movie
    handleToggleReviewing: () => void
    handleToggleEditing: (review: Review) => void
    handleReviewChange: (review: Review) => void
}

type review = {
    reviewId: string
    userId: string
    userName: string | null
    date: string
    movieId: string
    mediaType: string
    reviewContent: string;
    reviewRating: number;
}

const Reviews: FC<ReviewsProps> = (props) => {

    const { movie, handleToggleReviewing, handleToggleEditing } = props
    const mediaType = movie.title ? "movie" : "tv"
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null);
    const [localReviews, setLocalReviews] = useState<review[] | null | undefined>(null);
    const [currentUserReview, setCurrentUserReview] = useState<review | null>(null);

    const reviewsCollectionRef = collection(db, 'reviews')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                const fetchReviewsData = async () => {
                    try {
                        const querySnapshot = await getDocs(reviewsCollectionRef);
                        const fetchedReviews: review[] = [];

                        querySnapshot.forEach((doc) => {
                            const reviewData = doc.data() as review;
                            fetchedReviews.push(reviewData);
                        });


                        const filteredReviews = fetchedReviews.filter(
                            (review) =>
                                review.movieId === movie.id.toString() &&
                                review.mediaType === mediaType
                        );

                        const sortedReviews = filteredReviews.sort(
                            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                        );

                        setLocalReviews(sortedReviews);

                        const currentUserReview = sortedReviews.find(
                            (review) => review.userId === user.uid
                        );
                        setCurrentUserReview(currentUserReview || null);
                    } catch (error) {
                        console.error("Error fetching reviews data:", error);
                    }
                };

                fetchReviewsData();
            } else {
                setUser(null);
                const fetchReviewsData = async () => {
                    try {
                        const querySnapshot = await getDocs(reviewsCollectionRef);
                        const fetchedReviews: review[] = [];


                        querySnapshot.forEach((doc) => {
                            const reviewData = doc.data() as review;
                            fetchedReviews.push(reviewData);
                        });
                        const filteredReviews = fetchedReviews.filter(
                            (review) =>
                                review.movieId === movie.id.toString() &&
                                review.mediaType === mediaType
                        );
                        const sortedReviews = filteredReviews.sort(
                            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                        );
                        setLocalReviews(sortedReviews);
                    } catch (error) {
                        console.error("Error fetching reviews data:", error);
                    }
                }
                fetchReviewsData()
            }
        });
        return () => unsubscribe();
    }, [movie]);

    return (
        <div className='relative pr-10 flex flex-col gap-8'>
            <div className='w-max'>
                <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Reviews</h1>
                <div className='w-full h-1 bg-gradient' />
            </div>
            <div className='flex flex-col pt-6 gap-12 justify-start items-start'>
                {localReviews?.map((review) => (
                    <Review key={review.reviewId} review={review} isEditable={review.reviewId === currentUserReview?.reviewId ? true : false} handleToggleEditing={handleToggleEditing} />
                ))}
                {movie.reviews?.results.map((review) => (
                    <Review key={review.id} review={review} />
                ))}
            </div>
            {!currentUserReview && <button onClick={user ? handleToggleReviewing : () => navigate('/login')} className='w-max flex flex-row gap-2 justify-center items-center px-5 py-3 bg-button-primary-color text-bg-color rounded-2xl font-bold text-xs sm:max-4xl:text-lg transition-all hover:bg-accent-color hover:text-text-color'>
                + Review
            </button>}
        </div>
    )
}

export { Reviews };