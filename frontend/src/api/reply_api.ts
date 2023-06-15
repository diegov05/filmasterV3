import { Reply } from '../models/reply';
import { User } from '../models/user';

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error
        throw Error(errorMessage)
    }
}

export async function fetchReplies(): Promise<Reply[]> {
    const response = await fetchData("/api/replies", { method: "GET" })
    return response.json();
}


export async function fetchReply(replyId: string): Promise<Reply> {
    const replies = await fetchReplies();
    const filteredReply = replies.find((reply: Reply) => reply._id === replyId);
    const response = await fetchData(`/api/replies/${filteredReply?._id}`)
    return response.json()
}

export interface ReplyInput {
    author: User
    content: string
    parent: string
    likes: string[]
    dislikes: string[]
}

export async function createReply(reply: ReplyInput): Promise<Reply> {

    const { author, content, parent } = reply;

    if (!content || !parent || !author) {
        throw new Error("Reply must have author, content, and parent.");
    }

    const response = await fetchData("/api/replies",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reply),
        });
    return response.json()
}

export interface UpdateReplyInput {
    _id: string
    authorId: string
    content?: string
    likes?: string[]
    dislikes?: string[]
}

export async function updateReply(reply: UpdateReplyInput): Promise<Reply> {
    const replyDocument = await fetchReply(reply._id)
    const response = await fetchData(`/api/replies/${replyDocument._id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reply),
        });
    return response.json()
}

export async function deleteReply(replyId: string) {
    await fetchData(`/api/replies/${replyId}`,
        {
            method: "DELETE",
        }
    )
}