import { InferSchemaType, Schema, model } from "mongoose";
import { userSchema } from "./user"

const reviewSchema = new Schema({
    author: { type: userSchema, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    showId: { type: String, required: true },
    showType: { type: String, required: true },
    likes: [{ type: String }],
    dislikes: [{ type: String }],
}, { timestamps: true })

type Review = InferSchemaType<typeof reviewSchema>;

export default model<Review>("Review", reviewSchema);