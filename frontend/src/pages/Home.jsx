import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/Homepage/HighlightText";
import CTAButton from "../components/core/Homepage/Button"
import Banner from "../assets/images/banner.mp4";
import CodeBlocks from "../components/core/Homepage/CodeBlocks";
import TimelineSection from "../components/core/Homepage/TimelineSection";
import LearningLanguageSection from "../components/core/Homepage/LearningLanguageSection";
import InstructorSection from "../components/core/Homepage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/Homepage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider";

const Home = () => {
    return (
        <div>
            {/* SECTION - 1 */}
                <div className="relative mx-auto flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-8 text-white">
                       {/* Instructor Button */}
                        <Link to={"/signup"}>
                            <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                                <div className="flex flex-row items-center gap-2 rounded-full px-6 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                                    <p>Become an Instructor</p>
                                    <FaArrowRight />
                                </div>
                            </div>
                        </Link>

                         {/* Heading */}
                        <div className="text-center text-4xl font-semibold">
                            Empower Your Future with
                            <HighlightText text={"Coding Skills"} />
                        </div>

                         {/* Sub Heading */}
                        <div className="-mt-3 w-[90%] text-center text-lg text-richblack-300">
                            With our online coding courses, you can learn at your own pace, from
                            anywhere in the world, and get access to a wealth of resources,
                            including hands-on projects, quizzes, and personalized feedback from
                            instructors.
                        </div>

                        {/* CTA buttons */}
                        <div className="mt-6 flex flex-row gap-7">
                            <CTAButton active={true} linkto={"/signup"}>
                            Learn More
                            </CTAButton>
                            <CTAButton active={false} linkto={"/login"}>
                            Book a Demo
                            </CTAButton>
                        </div>

                          {/* Video */}
                        <div className="mx-3 my-7 w-fit h-[515px] shadow-[10px_-5px_50px_-5px] shadow-normalblue-200">
                            <video
                                className="shadow-[20px_20px_rgba(255,255,255)] w-[100%] h-[100%] "
                                muted
                                loop
                                autoPlay
                            >
                            <source src={Banner} type="video/mp4" />
                            </video>
                            </div>

                             {/* Code Section 1  */}
                            <div className="w-10/12">
                            <CodeBlocks
                                position={"lg:flex-row"}
                                heading={
                                <div className="text-4xl font-semibold">
                                    Unlock your
                                    <HighlightText text={"coding potential"} /> with our online
                                    courses.
                                </div>
                            }
                            subheading={
                                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                            }
                            ctabtn1={{
                                btnText: "Try it Yourself",
                                link: "/signup",
                                active: true,
                            }}
                            ctabtn2={{
                                btnText: "Learn More",
                                link: "/signup",
                                active: false,
                            }}
                            codeColor={"text-richyellow-25"}
                            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                            backgroundGradient={<div className="codeblock1 absolute"></div>}
                            />
                            </div>

                            
                            {/* Code Section 2 */}
                            <div className="w-11/12 pl-12">
                            <CodeBlocks
                                position={"lg:flex-row-reverse"}
                                heading={
                                    <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                                        Start
                                            <HighlightText text={"coding in seconds"} />
                                    </div>
                                }
                                subheading={
                                    "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                                }
                                ctabtn1={{
                                    btnText: "Continue Lesson",
                                    link: "/signup",
                                    active: true,
                                }}
                                ctabtn2={{
                                btnText: "Learn More",
                                link: "/signup",
                                active: false,
                                }}
                                codeColor={"text-white"}
                                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                                backgroundGradient={<div className="codeblock2 absolute"></div>}
                                />
                            </div>
                            
                              {/* Explore Section */}
                                <ExploreMore />
                            </div>

                {/* SECTION - 2 */}
                    <div className="bg-pure-greys-5 text-richblack-700">
                        <div className="homepage_bg h-[310px]">
                            <div className="w-11/12 max-w-[1260px] flex flex-col items-center justify-between gap-5 mx-auto">
                                <div className="h-[150px]"></div>
                                    <div className="flex flex-row gap-7 text-white mt-6">
                                        <CTAButton active={true} linkto={"/signup"}>
                                            <div className="flex items-center gap-3">
                                                Explore full Catalog
                                                <FaArrowRight />
                                            </div>
                                        </CTAButton>
                                        <CTAButton active={false} linkto={"/signup"}>
                                            <div className="flex items-center gap-3">Learn More</div>
                                        </CTAButton>
                                    </div>
                            </div>
                        </div>

                        <div className="mx-auto w-11/12 max-w-[1260px] flex flex-col items-center justify-between gap-7">
                            {/* Job that is in Demand - Section 1 */}
                            <div className="flex flex-row gap-5 mb-10 mt-[95px] justify-center mx-auto">
                                <div className="text-4xl font-semibold w-[45%]">
                                    Get the Skills you need for a
                                    <HighlightText text={"Job that is in demand"} />
                                </div>
                                <div className="flex flex-col items-start gap-10 lg:w-[40%]">
                                    <div className="text-[16px]">
                                        The modern StudyNotion is the dictates its own terms. Today, to
                                        be a competitive specialist requires more than professional
                                        skills.
                                    </div>
                                    <CTAButton active={true} linkto={"/signup"}>
                                        <div className="">Learn More</div>
                                    </CTAButton>
                                </div>
                            </div>

                            <TimelineSection />

                            <LearningLanguageSection />

                    </div>
                </div>

                
                {/* Section 3 */}
                <div className="relative mx-auto my-20 flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                    {/* Become a instructor section */}
                    <InstructorSection />

                    {/* Reviews from Other Learner */}
                    <h1 className="text-center text-4xl font-semibold mt-8">
                        Reviews from other learners
                    </h1>
                <ReviewSlider />
            </div>
        

                {/*footer*/}
        <Footer />
    </div>

    )
}


export default Home