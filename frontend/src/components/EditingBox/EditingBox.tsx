import { FC, useEffect, useState } from 'react'
import { Movie } from '../../interfaces/interfaces'
import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { updateReview } from '../../api/review_api'
import { User } from '../../models/user'
import { onAuthStateChanged } from 'firebase/auth'
import { fetchUser } from '../../api/user_api'
import { auth } from '../../firebase'
import { Review } from '../../models/review'

interface EditingBoxProps {
    movie: Movie
    handleToggleEditing: (review: Review) => void
    review: Review
}

const EditingBox: FC<EditingBoxProps> = (props) => {

    const { handleToggleEditing, review } = props
    const [userDocument, setUserDocument] = useState<User | null>(null);

    const [rating, setRating] = useState(review.rating);

    const handleReviewEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const reviewContent = form.reviewContent.value;
        const reviewRating = rating

        try {
            if (userDocument)
                await updateReview({
                    authorId: userDocument._id,
                    content: reviewContent,
                    rating: reviewRating,
                    likes: review.likes,
                    dislikes: review.dislikes
                })
            setRating(0);
            window.location.reload();
        } catch (error) {
            console.error('Error adding review:', error);
        }

        form.reviewContent.value = '';
        form.reviewRating.value = '';
    };

    const handleStarClick = (selectedRating: number) => {
        setRating(selectedRating);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocument = await fetchUser(user.uid)
                setUserDocument(userDocument)
            } else {
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className='slide-in-fwd-center flex flex-col justify-center items-center absolute bg-black/40 backdrop-blur-sm w-full h-full z-50'>
            <div className='w-3/4 h-full flex flex-col justify-center items-center'>
                <div className='flex flex-col justify-start items-start gap-4'>
                    <button onClick={() => handleToggleEditing(review)} className=' bg-white p-2 h-min rounded-xl flex flex-col justify-center items-center'>
                        <XMarkIcon className='w-4 h-4 text-text-color' />
                    </button>
                    <div className='shadow-xl z-50 flex flex-col justify-center items-start gap-8 shadow-black/40 rounded-2xl bg-bg-color p-6 xs:max-4xl:p-10'>
                        <div className='slide-in-fwd-center w-max'>
                            <h1 className='w-max font-bold text-2xl xs:max-sm:text-3xl sm:max-4xl:text-4xl pb-4 text-text-color'>Edit Review</h1>
                            <div className='slide-in-fwd-center w-full h-1 bg-gradient' />
                        </div>
                        <form onSubmit={handleReviewEdit} className='flex flex-col gap-4' action="">
                            <div className='flex flex-row flex-wrap items-center justify-center max-w-full w-44 xs:w-52 md:max-4xl:w-full'>
                                {[...Array(10)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={`cursor-pointer transition-all ${index < rating! ? 'text-amber-400 fill-amber-400' : ''
                                            } w-8`}
                                        onClick={() => handleStarClick(index + 1)}
                                    />
                                ))}
                            </div>
                            <textarea style={{ resize: 'none' }} className='max-w-full w-44 xs:w-52 md:max-4xl:w-full px-5 py-3 rounded-2xl outline-none border-none focus:outline-none focus:border-none' placeholder={review.content} name="reviewContent" id="reviewContent" cols={20} rows={10}>
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

export { EditingBox };