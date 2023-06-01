import express from "express"
import * as MoviesController from "../controllers/movies"

const router = express.Router()

router.get('/', MoviesController.getMovies)

router.get('/:movieId', MoviesController.getMovie)

export default router