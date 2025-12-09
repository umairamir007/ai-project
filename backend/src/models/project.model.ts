import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
    _id: Types.ObjectId;
    name: string;
    text: string;
    userId: Types.ObjectId;
    voice: string;
}

const projectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        text: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        voice: { type: String, required: true },
    },
    { timestamps: true }
);


const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;

