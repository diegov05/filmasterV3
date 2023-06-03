import { HandThumbDownIcon, HandThumbUpIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DocumentData, collection, deleteDoc, doc } from 'firebase/firestore';
import { FC, useState } from 'react'
import { db } from '../../firebase';

interface ReplyProps {
    reply: DocumentData
    isEditable: boolean
    handleToggleEditing?: (reply: DocumentData) => void
}

const Reply: FC<ReplyProps> = (props) => {

    const { reply, isEditable, handleToggleEditing } = props
    const [isLikeSelected, setIsLikeSelected] = useState<boolean>()
    const [isDislikeSelected, setIsDislikeSelected] = useState<boolean>()


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

    const handleDeleteReply = async () => {
        try {
            const repliesCollectionRef = collection(db, 'replies');
            await deleteDoc(doc(repliesCollectionRef, reply.replyId));
            console.log('Reply deleted from Firestore successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting reply from Firestore:', error);
        }
    };

    return (
        <div className='ml-16 slide-in-fwd-center flex flex-col gap-4 justify-start items-start'>
            <div className='flex flex-row gap-2 justify-start items-center'>
                <img className='w-4 h-4 rounded-full' src={reply.avatar} alt={reply.userName!} />
                <p className='font-bold text-sm'>{reply.replyAuthorName}</p>
            </div>
            <div>
                <p className='text-xs md:max-4xl:text-sm md:max-4xl:w-[80ch]'>{reply.content}</p>
            </div>
            <div className='flex flex-row gap-2 flex-wrap'>
                <button onClick={() => handleLikeOrDislike(0)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-3 py-px sm:max-4xl:py-2 bg-button-primary-color text-bg-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all ${isLikeSelected ? "bg-green-500" : "hover:bg-accent-color hover:text-text-color"}`}>
                    <HandThumbUpIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />
                </button>
                <button onClick={() => handleLikeOrDislike(1)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-3 py-1 sm:max-4xl:py-2 bg-white text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all ${isDislikeSelected ? "bg-red-500" : "hover:bg-accent-color hover:text-text-color"}`}>
                    <HandThumbDownIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />
                </button>
                {isEditable &&
                    <>
                        <button onClick={() => handleToggleEditing ? handleToggleEditing(reply) : ""} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-3 py-1 sm:max-4xl:py-2 bg-white text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all`}>
                            Edit
                            <PencilSquareIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />
                        </button>
                        <button onClick={handleDeleteReply} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-3 py-1 sm:max-4xl:py-2 bg-red-500 text-bg-color rounded-2xl font-bold text-[10px] transition-all`}>
                            <TrashIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />
                        </button>
                    </>}
            </div>
        </div>
    )
}

export { Reply };