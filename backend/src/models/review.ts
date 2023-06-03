import { InferSchemaType, Schema, model } from "mongoose";
import User from "./user";

const reviewSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    showId: { type: String, required: true },
    showType: { type: String, required: true },
    likes: [{ type: String }],
    dislikes: [{ type: String }],
}, { timestamps: true })

type Review = InferSchemaType<typeof reviewSchema>;

export default model<Review>("Review", reviewSchema);