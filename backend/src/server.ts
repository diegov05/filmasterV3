import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import env from './util/validateEnv'
import 'dotenv/config'

const app = express()
const port = env.PORT

mongoose.connect(env.MONGO_DB_CONNECTION_URI).then(() => {
    console.log("Connected to MongoDB Atlas.")
}).catch((error: string) => {
    console.error('Error connecting to MongoDB Atlas', error);
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World")
})