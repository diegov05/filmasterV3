import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import UserModel from "./models/user"

const app = express()

app.get('/', async (req, res, next) => {
    try {
        const users = await UserModel.find().exec()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
})

app.use((res, req, next) => {
    next(Error("Endpoint not found."))
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = `An unknow error occurred.`
    if (error instanceof Error) errorMessage = error.message
    res.status(500).json({
        error: errorMessage,
        status: 500
    })
})

export default app