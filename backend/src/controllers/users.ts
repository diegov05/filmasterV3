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
    email?: string
    firebaseId?: string
    username?: string
    password?: string
}

export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res, next) => {

    const email = req.body.email
    const firebaseId = req.body.firebaseId
    const username = req.body.username
    const password = req.body.password

    try {

        if (!email) {
            throw createHttpError(400, "User must have an email.")
        }
        if (!username) {
            throw createHttpError(400, "User must have a username.")
        }
        if (!firebaseId) {
            throw createHttpError(400, "User must have a valid id.")
        }
        if (!password) {
            throw createHttpError(400, "User must have a password.")
        }

        const existingUser = await UserModel.findOne({ username }).exec();
        if (existingUser) {
            throw createHttpError(409, "Username already exists.");
        }

        const newUser = await UserModel.create({
            email: email,
            firebaseId: firebaseId,
            username: username,
            password: password,
            avatar: `https://source.boringavatars.com/beam/120/${username}%20${email}?colors=F6F6F6,290521,FFD600,7216F4,FFFFFF`
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
    email?: string,
    username?: string,
    password?: string
}

export const updateUser: RequestHandler<UpdateUserParams, unknown, UpdateUserBody, unknown> = async (req, res, next) => {

    const userId = req.params.userId
    const newEmail = req.body.email
    const newUsername = req.body.username
    const newPassword = req.body.password

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id.")
        }

        if (!newEmail) {
            throw createHttpError(400, "User must have an email.")
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

        user.username = newUsername
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