import { RequestHandler } from "express"
import ReplyModel from "../models/reply"
import createHttpError from "http-errors"
import mongoose from "mongoose"

export const getReplies: RequestHandler = async (req, res, next) => {
    try {
        const replies = await ReplyModel.find().exec()
        res.status(200).json(replies)
    } catch (error) {
        next(error)
    }
}

export const getReply: RequestHandler = async (req, res, next) => {

    const replyId = req.params.replyId

    try {

        if (!mongoose.isValidObjectId(replyId)) {
            throw createHttpError(400, "Invalid reply id.")
        }

        const reply = await ReplyModel.findById(replyId).exec()

        if (!reply) {
            throw createHttpError(404, "Reply not found.")
        }

        res.status(200).json(reply)
    } catch (error) {
        next(error)
    }
}

interface CreateReplyBody {
    author?: string
    content?: string
    parent?: string
    likes?: string[]
    dislikes?: string[]
}

export const createReply: RequestHandler<unknown, unknown, CreateReplyBody, unknown> = async (req, res, next) => {

    const replyAuthor = req.body.author
    const replyContent = req.body.content
    const replyParent = req.body.parent
    const replyLikes = req.body.likes
    const replyDislikes = req.body.dislikes

    try {

        if (!replyAuthor) {
            throw createHttpError(400, "Reply must have an author.")
        }
        if (!replyContent) {
            throw createHttpError(400, "Reply must not be empty.")
        }
        if (!replyParent) {
            throw createHttpError(400, "Reply must have a parent.")
        }

        const newReply = await ReplyModel.create({
            author: replyAuthor,
            content: replyContent,
            parent: replyParent,
            likes: replyLikes,
            dislikes: replyDislikes,
        })

        res.status(201).json(newReply)
    } catch (error) {
        next(error)
    }
}

interface UpdateReplyParams {
    replyId: string
}

interface UpdateReplyBody {
    content?: string
    likes?: string[]
    dislikes?: string[]
}

export const updateReply: RequestHandler<UpdateReplyParams, unknown, UpdateReplyBody, unknown> = async (req, res, next) => {

    const replyId = req.params.replyId
    const newReplyContent = req.body.content
    const newReplyLikes = req.body.likes
    const newReplyDislikes = req.body.dislikes

    try {
        if (!mongoose.isValidObjectId(replyId)) {
            throw createHttpError(400, "Invalid reply id.")
        }

        if (!newReplyContent) {
            throw createHttpError(400, "Reply must not be empty.")
        }
        if (!newReplyLikes) {
            throw createHttpError(400, "Reply's likes must not be null.")
        }
        if (!newReplyDislikes) {
            throw createHttpError(400, "Reply's dislikes must not be null.")
        }

        const reply = await ReplyModel.findById(replyId).exec()

        if (!reply) {
            throw createHttpError(404, "Reply not found.")
        }

        reply.content = newReplyContent
        reply.likes = newReplyLikes
        reply.dislikes = newReplyDislikes

        const updatedReply = await reply.save()

        res.status(200).json(updatedReply)
    } catch (error) {
        next(error)
    }
}

export const deleteReply: RequestHandler = async (req, res, next) => {
    const replyId = req.params.replyId

    try {
        if (!mongoose.isValidObjectId(replyId)) {
            throw createHttpError(400, "Invalid reply id.")
        }

        const reply = await ReplyModel.findById(replyId).exec()

        if (!reply) {
            throw createHttpError(404, "Reply not found.")
        }

        await reply.deleteOne()

        res.sendStatus(204);

    } catch (error) {
        next(error)
    }
}