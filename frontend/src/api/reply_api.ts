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

export async function fetchCurrentUserReply(userId: string): Promise<Reply> {
    const replies = await fetchReplies();
    const filteredReply = replies.find((reply: Reply) => reply._id === userId);
    const response = await fetchData(`/api/replies/${filteredReply?._id}`)
    return response.json()
}

export async function fetchCurrentUserReplies(userId: string): Promise<Reply[]> {
    const replies = await fetchReplies();
    const filteredReplies = replies.filter((reply: Reply) => reply.author._id === userId);

    const responsePromises = filteredReplies.map((reply: Reply) => fetchData(`/api/replies/${reply._id}`));
    const responses = await Promise.all(responsePromises);

    const replyDataPromises = responses.map((response) => response.json());
    const replyData = await Promise.all(replyDataPromises);

    return replyData;
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
    authorId: string
    content?: string
    likes?: string[]
    dislikes?: string[]
}

export async function updateReply(reply: UpdateReplyInput): Promise<Reply> {
    const replyDocument = await fetchCurrentUserReply(reply.authorId)
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