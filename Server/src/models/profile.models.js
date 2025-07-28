import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema({
gender: {
    type: String,
    enum: ["Male", "Female", "other"],
    default: "Male",
},
dateOfBirth: {
    type: String,
},
about: {
    type: String,
    trim: true,
},
contactNumber: {
    type: Number,
    trim: true,
},
});

export const Profile = mongoose.model("Profile", profileSchema);