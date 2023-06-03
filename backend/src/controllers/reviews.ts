import { RequestHandler } from "express"
import ReviewModel from "../models/review"
import createHttpError from "http-errors"
import mongoose from "mongoose"

export const getReviews: RequestHandler = async (req, res, next) => {
    try {
        const reviews = await ReviewModel.find().exec()
        res.status(200).json(reviews)
    } catch (error) {
        next(error)
    }
}

export const getReview: RequestHandler = async (req, res, next) => {

    const reviewId = req.params.reviewId

    try {

        if (!mongoose.isValidObjectId(reviewId)) {
            throw createHttpError(400, "Invalid review id.")
        }

        const review = await ReviewModel.findById(reviewId).exec()

        if (!review) {
            throw createHttpError(404, "review not found.")
        }

        res.status(200).json(review)
    } catch (error) {
        next(error)
    }
}

interface CreateReviewBody {
    author?: string
    content?: string
    rating?: number
    showId?: string
    showType?: string
}

export const createReview: RequestHandler<unknown, unknown, CreateReviewBody, unknown> = async (req, res, next) => {

    const reviewContent = req.body.content
    const reviewRating = req.body.rating
    const showId = req.body.showId
    const showType = req.body.showType

    try {

        if (!reviewContent) {
            throw createHttpError(400, "Review must not be empty.")
        }
        if (!reviewRating) {
            throw createHttpError(400, "Review must be rated.")
        }
        if (!showId) {
            throw createHttpError(400, "Review must have a show/movie id.")
        }
        if (!showType) {
            throw createHttpError(400, "Review must specify show type (movie/tv).")
        }

        const newReview = await ReviewModel.create({
            reviewContent: reviewContent,
            showId: showId,
            showType: showType
        })

        res.status(201).json(newReview)
    } catch (error) {
        next(error)
    }
}

interface UpdateReviewParams {
    reviewId: string
}

interface UpdateReviewBody {
    content?: string
    rating?: number
}

export const updateReview: RequestHandler<UpdateReviewParams, unknown, UpdateReviewBody, unknown> = async (req, res, next) => {

    const reviewId = req.params.reviewId
    const newReviewContent = req.body.content
    const newReviewRating = req.body.rating

    try {
        if (!mongoose.isValidObjectId(reviewId)) {
            throw createHttpError(400, "Invalid review id.")
        }

        if (!newReviewContent) {
            throw createHttpError(400, "Review must not be empty.")
        }

        if (!newReviewRating) {
            throw createHttpError(400, "Review must be rated.")
        }

        const review = await ReviewModel.findById(reviewId).exec()

        if (!review) {
            throw createHttpError(404, "Review not found.")
        }

        review.content = newReviewContent
        review.rating = newReviewRating

        const updatedReview = await review.save()

        res.status(200).json(updatedReview)
    } catch (error) {
        next(error)
    }
}

export const deletereview: RequestHandler = async (req, res, next) => {
    const reviewId = req.params.reviewId

    try {
        if (!mongoose.isValidObjectId(reviewId)) {
            throw createHttpError(400, "Invalid review id.")
        }

        const review = await ReviewModel.findById(reviewId).exec()

        if (!review) {
            throw createHttpError(404, "Review not found.")
        }

        await review.deleteOne()

        res.sendStatus(204);

    } catch (error) {
        next(error)
    }
}