import app from './app'
import mongoose from 'mongoose'
import env from './util/validateEnv'
import express from 'express'
import path from "path"

const port = process.env.PORT || env.PORT

mongoose.connect(env.MONGO_DB_CONNECTION_URI).then(() => {
    console.log("Connected to MongoDB Atlas.")
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
}).catch((error: string) => {
    console.error('Error connecting to MongoDB Atlas', error);
})

app.use(express.static(path.resolve(__dirname, "../../frontend/dist")))
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
});

