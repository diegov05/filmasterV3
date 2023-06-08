import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true },
    firebaseId: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    favorites: { type: [String], required: false },
    watchList: { type: [String], required: false },
}, { timestamps: true })

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);