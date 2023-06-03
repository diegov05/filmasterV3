import { InferSchemaType, Schema, model } from "mongoose";
import User from "./user";

const replySchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parent: { type: String, required: true },
    likes: [{ type: String }],
    dislikes: [{ type: String }],
}, { timestamps: true })

type Reply = InferSchemaType<typeof replySchema>;

export default model<Reply>("Reply", replySchema);