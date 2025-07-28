import mongoose, { Schema } from "mongoose";
import { mailSender } from "../utils/mail.js";
import { otpTemplate } from "../mail/templates/emailVerificationTemplate.js";

const otpSchema = new Schema({
email: {
    type: String,
    required: true,
},
otp: { type: String, required: true },
createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
},
});

// a function to send email
async function sendVerificationEmail(email, otp) {
try {
    const mailResponse = await mailSender(
    email,
    "Verification Email from StudyNotion",
    otpTemplate(otp),
    );
    // console.log("Email sent successfully", mailResponse);
} catch (error) {
    console.error("Error occurred while sending email", error);
    throw new Error(error);
}
}

otpSchema.pre("save", async function (next) {
if(this.isNew) await sendVerificationEmail(this.email, this.otp);
next();
});

export const Otp = mongoose.model("Otp", otpSchema);