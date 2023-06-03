import express from "express"
import * as ReviewsController from "../controllers/reviews"

const router = express.Router()

router.get('/', ReviewsController.getReviews)

router.get('/:reviewId', ReviewsController.getReview)

router.post('/', ReviewsController.createReview)

router.patch('/:reviewId', ReviewsController.updateReview)

router.delete('/:reviewId', ReviewsController.deleteReview)

export default router