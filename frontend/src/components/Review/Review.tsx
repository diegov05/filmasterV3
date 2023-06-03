import { FC, useEffect, useState } from 'react';
import { Review } from '../../interfaces/interfaces';
import { HandThumbDownIcon, HandThumbUpIcon, PencilSquareIcon, TrashIcon, PaperAirplaneIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { DocumentData, collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Reply } from '../Reply/Reply';


interface ReviewProps {
    review: Review
    isEditable?: boolean
    handleToggleEditing?: (review: Review) => void
}

const Review: FC<ReviewProps> = (props) => {

    const colors = ["F6F6F6",
        "290521",
        "FFD600",
        "7216F4",
        "FFFFFF"]

    const { review, isEditable, handleToggleEditing } = props

    const navigate = useNavigate()

    const [isLikeSelected, setIsLikeSelected] = useState<boolean>()
    const [isDislikeSelected, setIsDislikeSelected] = useState<boolean>()
    const [isReplying, setIsReplying] = useState<boolean>()
    const [isRepliesShowing, setIsRepliesShowing] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<DocumentData | undefined>();
    const [replyContent, setReplyContent] = useState<string>("");
    const [replies, setReplies] = useState<DocumentData[]>([])
    const repliesCollectionRef = collection(db, 'replies')

    const filteredReplies = replies.filter((reply) => reply.id ? reply.id : reply.reviewId === review.id ? review.id : review.reviewId);

    const handleLikeOrDislike = (index: number) => {
        switch (index) {
            case 0:
                if (isLikeSelected) {
                    setIsLikeSelected(false)
                } else {
                    setIsLikeSelected(true)
                    setIsDislikeSelected(false)
                }
                break;
            case 1:
                if (isDislikeSelected) {
                    setIsDislikeSelected(false)
                } else {
                    setIsDislikeSelected(true)
                    setIsLikeSelected(false)
                }
                break;
        }
    }

    const handleDeleteReview = async () => {
        try {
            const reviewsCollectionRef = collection(db, 'reviews');
            await deleteDoc(doc(reviewsCollectionRef, review.reviewId));
            console.log('Review deleted from Firestore successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting review from Firestore:', error);
        }
    };

    const handleUploadReply = async () => {
        try {
            if (!replyContent) return;

            const repliesCollectionRef = collection(db, 'replies');
            const newReply = {
                replyId: doc(repliesCollectionRef).id,
                content: replyContent,
                replyAuthorId: user?.uid,
                replyAuthorName: user?.email,
                reviewAuthorName: review.author ? review.author : review.userName,
                reviewId: review.id ? review.id : review.reviewId,
                avatar: userData!.avatar
            };

            await setDoc(doc(repliesCollectionRef, newReply.replyId), newReply);
            console.log('Reply uploaded to Firestore successfully!');
            setReplyContent("");
        } catch (error) {
            console.error('Error uploading reply to Firestore:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                const userRef = doc(collection(db, 'users'), user.uid);

                onSnapshot(userRef, (snapshot) => {
                    const userData = snapshot.data();
                    setUserData(userData)
                });

            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'replies'), where('reviewId', '==', review.id ? review.id : review.reviewId)),
            (snapshot) => {
                const fetchedReplies = snapshot.docs.map((doc) => doc.data());
                setReplies(fetchedReplies);
            }
        );

        return () => unsubscribe();
    }, [review.reviewId]);

    return (
        <div className='flex flex-col gap-4 justify-start items-start'>
            <div className='flex flex-row gap-2 justify-start items-center'>
                {!review.author ? <img className='w-4 h-4 rounded-full' src={review.avatar} alt={review.userName!} />
                    : <img className='w-4 h-4 rounded-full' src={`https://source.boringavatars.com/beam/120/${review.author}?colors=${colors.join(",")}`} alt="" />}
                <p className='font-bold'>{review.author ? review.author : review.userName}</p>
                <span className="text-gradient">
                    <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 sm:max-4xl:w-6 sm:max-4xl:h-6">
                        <linearGradient id="gradient">
                            <stop className="main-stop" offset="0%" />
                            <stop className="alt-stop" offset="100%" />
                        </linearGradient>
                        <path stroke='url(#gradient)' strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </span>
                <p className='font-bold text-xs sm:max-4xl:text-base text-text-color/50'>
                    {review.author_details ? review.author_details.rating : review.reviewRating}
                </p>
            </div>
            <div>
                <p className='text-xs md:max-4xl:text-base md:max-4xl:w-[80ch]'>{review.content ? review.content.slice(0, 200) : review.reviewContent}{review.content?.length! > 200 ? "..." : ""}{review.reviewContent?.length! > 200 ? "..." : ""}</p>
            </div>
            <div className='flex flex-row gap-2 flex-wrap'>
                <button onClick={() => handleLikeOrDislike(0)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-button-primary-color text-bg-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all ${isLikeSelected ? "bg-green-500" : "hover:bg-accent-color hover:text-text-color"}`}>
                    <HandThumbUpIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                </button>
                <button onClick={() => handleLikeOrDislike(1)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-white text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all ${isDislikeSelected ? "bg-red-500" : "hover:bg-accent-color hover:text-text-color"}`}>
                    <HandThumbDownIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                </button>
                {!isEditable &&
                    <button onClick={() => {
                        user ? setIsReplying(!isReplying) : navigate('/login')
                    }} className=' flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-accent-color text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all hover:bg-white hover:shadow-sm hover:shadow-zinc-500 hover:text-text-color'>
                        Reply
                    </button>
                }
                {isEditable &&
                    <>
                        <button onClick={() => handleToggleEditing ? handleToggleEditing(review) : ""} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-white text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all`}>
                            Edit
                            <PencilSquareIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                        </button>
                        <button onClick={handleDeleteReview} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-5 py-1 sm:max-4xl:py-2 bg-red-500 text-bg-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all`}>
                            <TrashIcon className='w-3 h-3 sm:max-4xl:w-4 sm:max-4xl:h-4' />
                        </button>
                    </>}

            </div>
            {isReplying && <div className='flex flew-row justify-start items-center gap-2'>
                <img className='w-6 h-6 md:max-4xl:w-10 md:max-4xl:h-10' src={userData?.avatar} alt="" />
                <div className='flex flex-row gap-2'>
                    <input type="text" className='px-5 py-2 md:max-4xl:py-3 rounded-2xl bg-zinc-300 border-b focus:outline-none text-xs' placeholder='Write a reply...'
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <button onClick={handleUploadReply} className='flex flex-col justify-center items-center w-max px-4 py-2 md:max-4xl:py-3 rounded-2xl bg-button-primary-color text-bg-color'>
                        <PaperAirplaneIcon className='w-4 h-4' />
                    </button>
                </div>
            </div>}
            {filteredReplies.length > 0 &&
                <button onClick={() => setIsRepliesShowing(!isRepliesShowing)} className='flex flex-row gap-2 justify-start items-center px-5 py-3 bg-zinc-300/50 rounded-2xl text-xs'>{isRepliesShowing ? "Hide" : "View"} {filteredReplies.length} {filteredReplies.length > 1 ? "replies" : "reply"}
                    {!isRepliesShowing ? <ChevronDownIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' /> : <ChevronUpIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />}
                </button>
            }
            {isRepliesShowing && filteredReplies.map((reply) => (
                <Reply key={reply.replyId} reply={reply} isEditable={reply.replyAuthorId === user?.uid ? true : false} />
            ))}
        </div>
    )
}

export { Review };