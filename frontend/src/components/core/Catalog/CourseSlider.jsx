import React from 'react'

import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper/modules'

import Course_Card from './Course_Card'

const CourseSlider = ({Courses}) => {
    return (
        <>
        {Courses?.length ? (
            <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            modules={[FreeMode, Pagination]}
            breakpoints={{
                1024: {
                slidesPerView: 3,
                },
            }}
            className="max-w-[1200px] w-11/12 !h-auto my-[50px]"
            >
            {Courses?.map((course, i) => (
                <SwiperSlide key={i} className="w-full !h-auto">
                <Course_Card course={course} Height={"min-h-[250px]"} />
                </SwiperSlide>
            ))}
            </Swiper> 
        ) : (
            <p className="text-xl text-richblack-5">No Course Found</p>
        )}
        </>
    )
}

export default CourseSlider