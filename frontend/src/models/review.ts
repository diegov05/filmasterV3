import { User } from "./user";

export interface Review {
    _id: string
    author: User
    content: string
    rating: number
    showId: string
    showType: string
    likes: string[]
    dislikes: string[]
    createdAt: string
    updatedAt: string
}