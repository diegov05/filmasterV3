import app from './app'
import mongoose from 'mongoose'
import env from './util/validateEnv'

const port = env.PORT

mongoose.connect(env.MONGO_DB_CONNECTION_URI).then(() => {
    console.log("Connected to MongoDB Atlas.")
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
}).catch((error: string) => {
    console.error('Error connecting to MongoDB Atlas', error);
})

