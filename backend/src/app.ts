import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import usersRoute from "./routes/users"
import morgan from "morgan"

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use("/api/users", usersRoute)

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