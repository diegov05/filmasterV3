import { HandThumbDownIcon, HandThumbUpIcon, PaperAirplaneIcon, PencilSquareIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { FC, useEffect, useState } from 'react'
import { Reply } from '../../models/reply';
import { deleteReply, updateReply } from '../../api/reply_api';
import { User } from '../../models/user';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { fetchUser } from '../../api/user_api';

interface ReplyProps {
    reply: Reply
    isEditable: boolean
}

const Reply: FC<ReplyProps> = (props) => {

    const { reply, isEditable } = props
    const [updatedReply, setUpdatedReply] = useState<Reply>(reply)
    const [userDocument, setUserDocument] = useState<User | null>(null)
    const [updatedReplyContent, setUpdatedReplyContent] = useState<string>('')
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const handleLikeOrDislike = async (index: number) => {
        const updated = { ...updatedReply };
        if (!userDocument) {
            return
        }

        switch (index) {
            case 0:
                if (updated.likes.includes(userDocument?._id)) {
                    updated.likes = updated.likes.filter((like) => like !== userDocument?._id);
                } else {
                    updated.likes.push(userDocument?._id);
                    updated.dislikes = updated.dislikes.filter((dislike) => dislike !== userDocument?._id);
                }
                break;
            case 1:
                if (updated.dislikes.includes(userDocument?._id)) {
                    updated.dislikes = updated.dislikes.filter((dislike) => dislike !== userDocument?._id);
                } else {
                    updated.dislikes.push(userDocument?._id);
                    updated.likes = updated.likes.filter((like) => like !== userDocument?._id);
                }
                break;
        }

        setUpdatedReply(updated);
        await updateReply({
            authorId: userDocument._id,
            ...updated
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocument = await fetchUser(user.uid)
                if (!userDocument) {
                    return
                }
                setUserDocument(userDocument)
            } else {
            }
        });
        return () => unsubscribe();
    }, []);

    const handleReplyUpdate = async () => {
        const updated = { ...reply }
        if (!userDocument) {
            return
        }
        try {
            await updateReply({
                _id: updated._id,
                authorId: userDocument._id,
                content: updatedReplyContent,
                likes: updated.likes,
                dislikes: updated.dislikes,
            });
        } catch (error) {
            console.error("Error:", error)
        }

        window.location.reload()
    }

    const handleDeleteReply = async () => {
        try {
            await deleteReply(reply._id)
            window.location.reload();
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    return (
        <div className='ml-16 slide-in-fwd-center flex flex-col gap-4 justify-start items-start'>
            {!isEditing &&
                <>
                    <div className='flex flex-row gap-2 justify-start items-center'>
                        <img className='w-4 h-4 rounded-full' src={reply.author.avatar} alt={reply.author.username!} />
                        <p className='font-bold text-sm'>{reply.author.username}</p>
                    </div>
                    <div>
                        <p className='text-xs md:max-4xl:text-sm md:max-4xl:w-[80ch]'>{reply.content}</p>
                    </div>
                    <div className='flex flex-row gap-2 flex-wrap'>
                        <button onClick={() => handleLikeOrDislike(0)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-3 py-px sm:max-4xl:py-2 bg-button-primary-color text-bg-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all ${userDocument ? updatedReply.likes.includes(userDocument?._id) ? "bg-green-500" : "" : ""}`}>
                            <HandThumbUpIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />
                            {updatedReply.likes.length}
                        </button>
                        <button onClick={() => handleLikeOrDislike(1)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-3 py-1 sm:max-4xl:py-2 text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all ${userDocument ? updatedReply.dislikes.includes(userDocument?._id) ? "bg-red-500" : "" : ""}`}>
                            <HandThumbDownIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />
                            {updatedReply ? updatedReply.dislikes.length : reply.dislikes.length}
                        </button>
                        {isEditable &&
                            <>
                                <button onClick={() => setIsEditing(!isEditing)} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-3 py-1 sm:max-4xl:py-2 bg-white text-text-color rounded-2xl font-bold text-[10px] sm:max-4xl:text-sm transition-all`}>
                                    Edit
                                    <PencilSquareIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />
                                </button>
                                <button onClick={handleDeleteReply} className={`shadow-sm shadow-zinc-500 flex flex-row gap-2 justify-center items-center px-3 py-1 sm:max-4xl:py-2 bg-red-500 text-bg-color rounded-2xl font-bold text-[10px] transition-all`}>
                                    <TrashIcon className='w-2 h-2 sm:max-4xl:w-3 sm:max-4xl:h-3' />
                                </button>
                            </>
                        }
                    </div>
                </>
            }
            {isEditing &&
                <div className='flex flew-row justify-start items-center gap-2'>
                    <object data={userDocument?.avatar} className='w-4 h-4' type="image/jpeg">
                        <UserIcon className='w-4 h-4 text-text-color' />
                    </object>
                    <div className='flex flex-row gap-2'>
                        <input type="text" className='px-5 py-2 md:max-4xl:py-3 rounded-2xl bg-zinc-300 border-b focus:outline-none text-xs' placeholder={reply.content} value={updatedReplyContent}
                            onChange={(e) => setUpdatedReplyContent(e.target.value)}
                        />
                        <button onClick={handleReplyUpdate} className='flex flex-col justify-center items-center w-max px-4 py-2 md:max-4xl:py-3 rounded-2xl bg-button-primary-color text-bg-color'>
                            <PaperAirplaneIcon className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export { Reply };