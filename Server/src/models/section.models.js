import mongoose, { Schema } from "mongoose";
import { SubSection } from "./subSection.models.js";

const sectionSchema = new Schema({
sectionName: {
    type: String,
},
subSection: [
    {
    type: Schema.Types.ObjectId,
    ref: "SubSection",
    required: true,
    },
],
});

export const Section = mongoose.model("Section", sectionSchema);