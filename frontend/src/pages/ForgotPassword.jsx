import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    };

    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {loading ? (
            <div className="spinner"></div>
        ) : (
            <div className="max-w-[500px] p-4 lg:p-8">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                {!emailSent ? "Reset your Password" : "Check your Email"}{" "}
            </h1>
            <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                {!emailSent
                ? "Have no fear. We’ll email you instructions to reset your password. If you don't have access to your email we can try account recovery"
                : `We have sent the reset email to ${email}`}
            </p>
            <form onSubmit={handleOnSubmit} className="w-full">
                {!emailSent && (
                <label htmlFor="email">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Email Address
                    </p>
                    <input
                    type="email"
                    required
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    className="flex h-10 w-full text-richblack-5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </label>
                )}
                <button
                type="submit"
                className="mt-6 w-full rounded-[8px] bg-richyellow-50 py-[12px] px-[12px] font-medium text-richblack-900 cursor-pointer"
                >
                {!emailSent ? "Reset Password" : "Resend Email"}
                </button>
            </form>
            <div className="mt-6 flex items-center justify-between">
                <Link to="/login">
                <p className="flex items-center gap-x-2 text-richblack-5">
                    <BiArrowBack />
                    Back to login
                </p>
                </Link>
            </div>
            </div>
        )}
        </div>
    );
};

export default ForgotPassword;