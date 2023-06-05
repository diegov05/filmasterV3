import { User } from "./user";

export interface Reply {
    _id: string,
    author: User
    content: string
    parent: string
    likes: string[]
    dislikes: string[]
    createdAt: string,
    updatedAt: string,
}