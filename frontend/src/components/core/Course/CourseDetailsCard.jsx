    import React from "react";
    import { toast } from "react-hot-toast";
    import { BsFillCaretRightFill } from "react-icons/bs";
    import { FaShareSquare } from "react-icons/fa";
    import { useDispatch, useSelector } from "react-redux";
    import { useNavigate } from "react-router-dom";

    import { addToCart } from "../../../slices/cartSlice";
    import { ACCOUNT_TYPE } from "../../../utils/constants";

    function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,
        courseName,
        instructions = [],
        studentsEnrolled = [],
    } = course;

    const isEnrolled = user && studentsEnrolled.includes(user._id);

    const handleShare = () => {
        if (navigator.share) {
        navigator
            .share({
            title: courseName,
            text: "Check out this course!",
            url: window.location.href,
            })
            .then(() => toast.success("Thanks for sharing!"))
            .catch(() => toast.error("Sharing failed or cancelled"));
        } else {
        toast("Sharing is not supported on this device.");
        }
    };

    const handleAddToCart = () => {
        if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
        toast.error("You are an Instructor. You can't buy a course.");
        return;
        }

        if (token) {
        dispatch(addToCart(course));
        return;
        }

        setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to add To Cart",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
        });
    };

    return (
        <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
        {/* Course Image */}
        <img
            src={ThumbnailImage}
            alt={courseName}
            className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
            <div className="space-x-3 pb-4 text-3xl font-semibold">Rs. {CurrentPrice}</div>

            <div className="flex flex-col gap-4">
            <button
                className="cursor-pointer rounded-md bg-richyellow-50 px-[20px] py-[8px] font-semibold text-richblack-900"
                onClick={() =>
                isEnrolled
                    ? navigate("/dashboard/enrolled-courses")
                    : handleBuyCourse()
                }
            >
                {isEnrolled ? "Go To Course" : "Buy Now"}
            </button>

            {!isEnrolled && (
                <button
                onClick={handleAddToCart}
                className="cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5"
                >
                Add to Cart
                </button>
            )}
            </div>

            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            30-Day Money-Back Guarantee
            </p>

            <div>
            <p className="my-2 text-xl font-semibold">This Course Includes:</p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                {instructions.map((item, i) => (
                <p className="flex gap-2" key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                </p>
                ))}
            </div>
            </div>

            <div className="text-center">
            <button
                className="mx-auto flex items-center gap-2 py-6 text-richyellow-100"
                onClick={handleShare}
            >
                <FaShareSquare size={15} /> Share
            </button>
            </div>
        </div>
        </div>
    );
    }

    export default CourseDetailsCard;
