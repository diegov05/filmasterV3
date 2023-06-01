import { InferSchemaType, Schema, model } from "mongoose";

const movieSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    posterPath: {
        type: String,
        required: true,
    },
    backdropPath: {
        type: String,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
    voteAverage: {
        type: Number,
        required: true,
    },
    voteCount: {
        type: Number,
        required: true,
    },
    trailerKeys: {
        type: [String],
        required: true,
    },
});

type Movie = InferSchemaType<typeof movieSchema>;

export default model<Movie>("Movie", movieSchema);