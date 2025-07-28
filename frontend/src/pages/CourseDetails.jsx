import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";

import ReactMarkdown from "react-markdown";

import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import GetAvgRating from "../utils/avgRating";
import { formatDate } from "../services/formatDate";

import RatingStars from "../components/common/RatingStars";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Footer from "../components/common/Footer";
import Error from "./Error";

function CourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, loading } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { paymentLoading } = useSelector((state) => state.course);

    const [courseData, setCourseData] = useState(null);
    const [avgRating, setAvgRating] = useState(0);
    const [totalLectures, setTotalLectures] = useState(0);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [activeSections, setActiveSections] = useState([]);

    useEffect(() => {
        (async () => {
        try {
            const res = await fetchCourseDetails(courseId);
            if (res.success) {
            const details = res.data.courseDetails;
            setCourseData(details);
            setAvgRating(GetAvgRating(details.ratingAndReviews));

            const total = details.courseContent.reduce(
                (acc, section) => acc + (section.subSection?.length || 0),
                0
            );
            setTotalLectures(total);
            } else {
            setCourseData(null);
            }
        } catch (err) {
            console.error("Error fetching course:", err);
            setCourseData(null);
        }
        })();
    }, [courseId]);

    const handleBuyCourse = () => {
        if (paymentLoading) return; // prevent double clicks while paying

        if (!token) {
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to purchase the course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        });
        return;
        }
        buyCourse(token, [courseId], user, navigate, dispatch);
    };

    const handleToggleSection = (id) => {
        setActiveSections((prev) =>
        prev.includes(id) ? prev.filter((sec) => sec !== id) : [...prev, id]
        );
    };

    if (loading || !courseData) {
        return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner" />
        </div>
        );
    }

    const {
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent = [],
        ratingAndReviews = [],
        instructor,
        studentsEnrolled = [],
        createdAt,
        totalDuration,
    } = courseData;

    return (
        <>
        <div className="w-full bg-richblack-800">
            <div className="mx-auto px-4 lg:w-[1260px] 2xl:relative">
            {/* Hero Section */}
            <div className="grid min-h-[450px] justify-items-center py-8 lg:justify-items-start xl:max-w-[810px]">
                {/* Mobile Thumbnail */}
                <div className="relative block max-h-[30rem] lg:hidden">
                <div className="absolute inset-0 shadow-[#161D29_0px_-64px_36px_-28px_inset]" />
                <img src={thumbnail} alt={`Thumbnail for ${courseName}`} className="w-full" />
                </div>

                {/* Course Info */}
                <div className="z-30 my-5 flex flex-col gap-4 py-5 text-richblack-5">
                <h1 className="text-4xl font-bold">{courseName}</h1>
                <p className="text-richblack-200">{courseDescription}</p>
                <div className="flex flex-wrap items-center gap-2 text-md">
                    <span className="text-richyellow-25">{avgRating.toFixed(1)}</span>
                    <RatingStars Review_Count={avgRating} Star_Size={24} />
                    <span>({ratingAndReviews.length} reviews)</span>
                    <span>{studentsEnrolled.length} students enrolled</span>
                </div>
                <p>
                    Created by {instructor?.firstName} {instructor?.lastName}
                </p>
                <div className="flex flex-wrap gap-5 text-lg">
                    <p className="flex items-center gap-2">
                    <BiInfoCircle /> Created at {formatDate(createdAt)}
                    </p>
                    <p className="flex items-center gap-2">
                    <HiOutlineGlobeAlt /> English
                    </p>
                </div>
                </div>

                {/* Mobile Pricing */}
                <div className="flex w-full flex-col gap-4 border-y border-richblack-500 py-4 lg:hidden">
                <p className="pb-4 text-3xl font-semibold text-richblack-5">Rs. {price}</p>
                <button
                    className="rounded-md bg-richyellow-50 py-2 font-semibold text-richblack-900 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleBuyCourse}
                    disabled={paymentLoading}
                >
                    {paymentLoading ? "Processing..." : "Buy Now"}
                </button>
                <button
                    className="rounded-md bg-richblack-800 py-2 font-semibold text-richblack-5 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={paymentLoading}
                >
                    {paymentLoading ? "Please wait..." : "Add to Cart"}
                </button>
                </div>
            </div>

            {/* Desktop Pricing */}
            <div className="right-[1rem] top-[60px] hidden min-h-[600px] w-1/3 max-w-[410px] lg:absolute lg:block">
                <CourseDetailsCard
                course={courseData}
                setConfirmationModal={setConfirmationModal}
                handleBuyCourse={handleBuyCourse}
                paymentLoading={paymentLoading} 
                />
            </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto px-4 text-richblack-5 lg:w-[1260px]">
            <div className="xl:max-w-[810px]">
            {/* What You'll Learn */}
            <div className="my-8 border border-richblack-600 p-8">
                <h2 className="text-3xl font-semibold">What you'll learn</h2>
                <div className="mt-5">
                <ReactMarkdown>{whatYouWillLearn || ""}</ReactMarkdown>
                </div>
            </div>

            {/* Course Content */}
            <div>
            <div className="flex flex-col gap-3">
                <h2 className="text-[28px] font-semibold">Course Content</h2>
                <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                    <span>{courseContent.length} section(s)</span>
                    <span>{totalLectures} lecture(s)</span>
                    <span>{totalDuration || "0h"} total length</span>
                </div>
                <div className="flex gap-3">
                    <button
                    onClick={() => setActiveSections(courseContent.map((s) => s._id))}
                    className="text-richyellow-25"
                    >
                    Expand all
                    </button>
                    <button
                    onClick={() => setActiveSections([])}
                    className="text-richyellow-25"
                    >
                    Collapse all
                    </button>
                </div>
                </div>
            </div>

                <div className="py-4">
                {courseContent.length === 0 ? (
                    <p className="text-richblack-200">No course content available.</p>
                ) : (
                    courseContent.map((section, idx) => (
                    <CourseAccordionBar
                        key={idx}
                        course={section}
                        isActive={activeSections}
                        handleActive={handleToggleSection}
                    />
                    ))
                )}
                </div>

                {/* Author */}
                <div className="mb-12 py-4">
                <h2 className="text-[28px] font-semibold">Author</h2>
                <div className="flex items-center gap-4 py-4">
                    <img
                    src={
                        instructor?.image ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${instructor?.firstName}%20${instructor?.lastName}`
                    }
                    alt="Author"
                    className="h-14 w-14 rounded-full object-cover"
                    />
                    <p className="text-lg">{`${instructor?.firstName} ${instructor?.lastName}`}</p>
                </div>
                <p className="text-richblack-50">
                    {instructor?.additionalDetails?.about || ""}
                </p>
                </div>
            </div>
            </div>
        </div>

        <Footer />
        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    );
}

export default CourseDetails;
