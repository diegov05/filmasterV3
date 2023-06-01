import { RequestHandler } from "express"
import MovieModel from "../models/movie"
import createHttpError from "http-errors"
import mongoose from "mongoose"

export const getMovies: RequestHandler = async (req, res, next) => {
    try {
        const movies = await MovieModel.find().exec()
        res.status(200).json(movies)
    } catch (error) {
        next(error)
    }
}

export const getMovie: RequestHandler = async (req, res, next) => {

    const movieId = req.params.movieId

    try {

        if (!mongoose.isValidObjectId(movieId)) {
            throw createHttpError(400, "Invalid movie id.")
        }

        const movie = await MovieModel.findById(movieId).exec()

        if (!movie) {
            throw createHttpError(404, "Movie not found.")
        }

        res.status(200).json(movie)
    } catch (error) {
        next(error)
    }
}

