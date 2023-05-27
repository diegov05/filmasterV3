import { RequestHandler } from "express"
import UserModel from "../models/user"
import createHttpError from "http-errors"
import mongoose from "mongoose"

export const getUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await UserModel.find().exec()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export const getUser: RequestHandler = async (req, res, next) => {

    const userId = req.params.userId

    try {

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id.")
        }

        const user = await UserModel.findById(userId).exec()

        if (!user) {
            throw createHttpError(404, "User not found.")
        }

        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

interface CreateUserBody {
    username?: string
    password?: string
}

export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res, next) => {

    const username = req.body.username
    const password = req.body.password

    try {

        if (!username) {
            throw createHttpError(400, "User must have a username.")
        }

        const newUser = await UserModel.create({
            userName: username,
            password: password,
        })

        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

interface UpdateUserParams {
    userId: string
}

interface UpdateUserBody {
    username?: string,
    password?: string
}

export const updateUser: RequestHandler<UpdateUserParams, unknown, UpdateUserBody, unknown> = async (req, res, next) => {

    const userId = req.params.userId
    const newUsername = req.body.username
    const newPassword = req.body.password

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id.")
        }

        if (!newUsername) {
            throw createHttpError(400, "User must have a username.")
        }

        if (!newPassword) {
            throw createHttpError(400, "User must have a password.")
        }

        const user = await UserModel.findById(userId).exec()

        if (!user) {
            throw createHttpError(404, "User not found.")
        }

        user.userName = newUsername
        user.password = newPassword

        const updatedUser = await user.save()

        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}

export const deleteUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id.")
        }

        const user = await UserModel.findById(userId).exec()

        if (!user) {
            throw createHttpError(404, "User not found.")
        }

        await user.deleteOne()

        res.sendStatus(204);

    } catch (error) {
        next(error)
    }
}