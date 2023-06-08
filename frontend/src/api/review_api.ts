import { Review } from '../models/review';
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

export async function fetchReviews(): Promise<Review[]> {
    const response = await fetchData("/api/reviews", { method: "GET" })
    return response.json();
}

export async function fetchCurrentUserReview(userId: string): Promise<Review> {
    const reviews = await fetchReviews();
    const filteredReview = reviews.find((review: Review) => review.author._id === userId);
    const response = await fetchData(`/api/reviews/${filteredReview?._id}`)
    return response.json()
}

export interface ReviewInput {
    author: User
    content: string
    rating: number
    showId: string
    showType: string
    likes: string[]
    dislikes: string[]
}

export async function createReview(review: ReviewInput): Promise<Review> {
    const response = await fetchData("/api/reviews",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(review),
        });
    return response.json()
}

export interface UpdateReviewInput {
    authorId: string
    content?: string
    rating?: number
    likes?: string[]
    dislikes?: string[]
}

export async function updateReview(review: UpdateReviewInput): Promise<Review> {
    const reviewDocument = await fetchCurrentUserReview(review.authorId)
    const response = await fetchData(`/api/reviews/${reviewDocument._id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(review),
        });
    return response.json()
}

export async function deleteReview(reviewId: string) {
    await fetchData(`/api/reviews/${reviewId}`,
        {
            method: "DELETE",
        }
    )
}