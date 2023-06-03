import express from "express"
import * as RepliesController from "../controllers/replies"

const router = express.Router()

router.get('/', RepliesController.getReplies)

router.get('/:replyId', RepliesController.getReply)

router.post('/', RepliesController.createReply)

router.patch('/:replyId', RepliesController.updateReply)

router.delete('/:replyId', RepliesController.deleteReply)

export default router