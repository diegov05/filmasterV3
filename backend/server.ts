import express from 'express'
import mongoose from 'mongoose'

const app = express()
const port = 3000

mongoose.connect('mongodb+srv://diegovs05:<yyXShegVUVuvSNFp>@filmaster.6qqvrjx.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log("Connected to MongoDB Atlas.")
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})