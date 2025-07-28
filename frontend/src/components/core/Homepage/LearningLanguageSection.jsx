import React from "react";
import HighlightText from "./HighlightText";
import CTAButton from "../../../components/core/Homepage/Button";
import Know_your_progress from "../../../assets/images/Know_your_progress.svg";
import Compare_with_others from "../../../assets/images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/images/Plan_your_lessons.svg";


const LearningLanguageSection = () => {
    return (
        <div className="mt-[130px]">
        <div className="flex flex-col gap-5 items-center">
            <div className="text-4xl font-semibold text-center">
            Your Swiss Knife for
            <HighlightText text={"learning any language"}></HighlightText>
            </div>
            <div className="text-center text-richblack-600 mx-auto text-base font-medium w-[70%]">
            Using spin making learning multiple languages easy. with 20+ languages
            realistic voice-over, progress tracking, custom schedule and more.
            </div>
            <div className="flex flex-row items-center justify-center mt-5 ">
            <img
                src={Know_your_progress}
                alt="Know your progress image"
                className="object-contain  lg:-mr-32 "
            />
            <img
                src={Compare_with_others}
                alt="Compare with others image"
                className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
            />
            <img
                src={Plan_your_lessons}
                alt="Plan with others image"
                className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
            />
            </div>
            <div className="w-fit my-12">
            <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
            </div>
        </div>
        </div>
    );
};

export default LearningLanguageSection;