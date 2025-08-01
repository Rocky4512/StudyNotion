import React from "react";
import TimeLineImage from "../../../assets/images/TimelineImage.png";
import Logo1 from "../../../assets/timelineLogos/Logo1.svg";
import Logo2 from "../../../assets/timelineLogos/Logo2.svg";
import Logo3 from "../../../assets/timelineLogos/Logo3.svg";
import Logo4 from "../../../assets/timelineLogos/Logo4.svg";

const TimeLine = [
    {
        Logo: Logo1,
        Heading: "Leadership",
        Description: "Fully committed to the success company",
    },
    {
        Logo: Logo2,
        Heading: "Responsibility",
        Description: "Students will always be our top priority",
    },
    {
        Logo: Logo3,
        Heading: "Flexibility",
        Description: "The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        Heading: "Solve the problem",
        Description: "Code your way to a solution",
    },
];

const TimelineSection = () => {
    return (
        <div>
        <div className="flex flex-row gap-15 items-center">
            <div className="w-[45%] flex flex-col gap-5">
            {TimeLine.map((element, index) => {
                return (
                <div className="flex flex-row gap-6 relative" key={index}>
                    <div className="w-[52px] h-[52px] rounded-full bg-white flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                    <img src={element.Logo} alt="" />
                    </div>

                    <div>
                    <h2 className="font-semibold text-[18px]">
                        {element.Heading}
                    </h2>
                    <p className="text-base">{element.Description}</p>
                    </div>

                    <div
                    className={`hidden ${
                        TimeLine.length - 1 === index ? "hidden" : "lg:block"
                    }  h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px] absolute top-[53px]`}
                    ></div>
                </div>
                );
            })}
            </div>
            <div className="relative w-fit h-fit shadow-normalblue-200 shadow-[0px_0px_80px_0px]">
            <img
                src={TimeLineImage}
                alt="timelineImage"
                className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit"
            />
            <div className="absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-48%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 ">
                {/* Section 1 */}
                <div className="flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14">
                <p className="text-3xl font-bold w-[75px]">10</p>
                <p className="text-caribbeangreen-300 text-sm w-[75px]">
                    Years experiences
                </p>
                </div>

                {/* Section 2 */}
                <div className="flex gap-5 items-center lg:px-14 px-7">
                <p className="text-3xl font-bold w-[75px]">250</p>
                <p className="text-caribbeangreen-300 text-sm w-[75px]">
                    types of courses
                </p>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    };

export default TimelineSection;