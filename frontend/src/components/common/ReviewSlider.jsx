import React, {useEffect, useState} from "react";
import ReactStars from "react-stars";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";


import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";

import { FaStar } from "react-icons/fa";

import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
    const [reviews, setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(() => {
    (async () => {
        const { data } = await apiConnector(
            "GET",
            ratingsEndpoints.REVIEWS_DETAILS_API
        );
        console.log("Fetched Review Data →", data);
        if (data?.success) {
            setReviews(data?.data);
        }
        })();
    }, []);

        if (!reviews || reviews.length === 0) {
            return (
                <div className="text-white text-center py-10">
                    No reviews available.
                </div>
            );
        }


    return (
        <div className="w-full">
        <div className="my-[50px] h-[184px] max-w-[650px] lg:max-w-[1260px]">
            <Swiper
            slidesPerView={4}
            spaceBetween={25}
            loop={true}
            freeMode={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            modules={[FreeMode, Pagination, Autoplay]}
            className="w-full "
            >
            {reviews.map((review, i) => {
                return (
                <SwiperSlide key={i}>
                    <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 rounded-xl">
                    <div className="flex items-center gap-4">
                        <img
                        src={
                            review?.user?.image
                            ? review?.user?.image
                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName}%20${review?.user?.lastName}`
                        }
                        alt="Profile Pic of the reviewer"
                        className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                        <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                        <h2 className="text-[12px] font-medium text-richblack-400">
                            {review?.course?.courseName}
                        </h2>
                        </div>
                    </div>
                    <p className="font-medium text-richblack-25">
                        {review?.review.split(" ").length > truncateWords
                        ? `${review?.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                        : `${review?.review}`}
                    </p>
                    <div className="flex items-center gap-2 ">
                        <h3 className="font-semibold text-richyellow-100">
                        {review.rating.toFixed(1)}
                        </h3>
                        <ReactStars
                        count={5}
                        value={review.rating}
                        size={20}
                        edit={false}
                        color2="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                        />
                    </div>
                    </div>
                </SwiperSlide>
                );
            })}
            {/* <SwiperSlide>Slide 1</SwiperSlide> */}
            </Swiper>
        </div>
        </div>
    );
}

export default ReviewSlider;
