import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"

import usersRoute from "./routes/users"
import reviewsRoute from "./routes/reviews"
import repliesRoute from "./routes/replies"

import morgan from "morgan"
import createHttpError, { isHttpError } from "http-errors"

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use("/api/users", usersRoute)
app.use("/api/reviews", reviewsRoute)
app.use("/api/replies", repliesRoute)

app.use((res, req, next) => {
    next(createHttpError(404, "Endpoint not found."))
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = `An unknow error occurred.`
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status
        errorMessage = error.message
    }
    res.status(statusCode).json({
        error: errorMessage,
        status: statusCode
    })
})

export default app