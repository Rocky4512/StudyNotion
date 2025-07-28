import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
{
firstName: {
    type: String,
    required: true,
    trim: true,
},
lastName: {
    type: String,
    required: true,
    trim: true,
},
email: {
    type: String,
    required: true,
    trim: true,
},
password: {
    type: String,
    required: true,
},
accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    default: "Admin",
    required: true,
},
active: {
    type: Boolean,
    default: true,
},
additionalDetails: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
},
courses: [
    {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
],
image: {
    type: String,
    required: true,
},

token: {
    type: String,
},
resetPasswordToken: {
    type: String,
},
resetPasswordExpire: {
    type: Date,
},

courseProgress: [
    {
        type: Schema.Types.ObjectId,
        ref: "CourseProgress",
    },
    ],
},
{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
