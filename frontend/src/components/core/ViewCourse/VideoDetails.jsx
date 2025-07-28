    import React, { useEffect, useRef, useState } from "react";
    import { useDispatch, useSelector } from "react-redux";
    import { useNavigate, useParams, useLocation } from "react-router-dom";

    import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
    import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
    import IconBtn from "../../common/IconBtn";

    const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const playerRef = useRef(null);

    const { token } = useSelector((state) => state.auth);
    const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse);

    const [videoData, setVideoData] = useState(null);
    const [previewSource, setPreviewSource] = useState("");
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!courseSectionData.length) return;

        const section = courseSectionData.find((sec) => sec._id === sectionId);
        const sub = section?.subSection?.find((sub) => sub._id === subSectionId);

        if (!section || !sub || !courseId) {
        navigate("/dashboard/enrolled-courses");
        return;
        }

        setVideoData(sub);
        setPreviewSource(courseEntireData?.thumbnail || "");
        setVideoEnded(false);
    }, [courseSectionData, courseEntireData, location.pathname, courseId, sectionId, subSectionId, navigate]);

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
        (data) => data._id === subSectionId
        );
        return currentSectionIndex === 0 && currentSubSectionIndex === 0;
    };

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const section = courseSectionData[currentSectionIndex];
        const currentSubSectionIndex = section?.subSection?.findIndex((data) => data._id === subSectionId);

        if (currentSubSectionIndex < section.subSection.length - 1) {
        const nextSubSectionId = section.subSection[currentSubSectionIndex + 1]._id;
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        } else if (currentSectionIndex < courseSectionData.length - 1) {
        const nextSection = courseSectionData[currentSectionIndex + 1];
        const nextSubSectionId = nextSection?.subSection?.[0]?._id;
        if (nextSection && nextSubSectionId) {
            navigate(`/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSubSectionId}`);
        }
        }
    };

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const section = courseSectionData[currentSectionIndex];
        const currentSubSectionIndex = section?.subSection?.findIndex((data) => data._id === subSectionId);

        if (currentSubSectionIndex > 0) {
        const prevSubSectionId = section.subSection[currentSubSectionIndex - 1]._id;
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
        } else if (currentSectionIndex > 0) {
        const prevSection = courseSectionData[currentSectionIndex - 1];
        const lastSubSectionId = prevSection.subSection[prevSection.subSection.length - 1]._id;
        navigate(`/view-course/${courseId}/section/${prevSection._id}/sub-section/${lastSubSectionId}`);
        }
    };

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
        (data) => data._id === subSectionId
        );
        return (
        currentSectionIndex === courseSectionData.length - 1 &&
        currentSubSectionIndex === courseSectionData[currentSectionIndex].subSection.length - 1
        );
    };

    const handleLectureCompletion = async () => {
        // console.log("Mark as completed clicked");
        setLoading(true);
        const res = await markLectureAsComplete({ courseId: courseId, subsectionId: subSectionId }, token);
        if (res) {
        dispatch(updateCompletedLectures(subSectionId));
        }
        setLoading(false);
    };

    const { title, description, videoUrl } = videoData || {};

    return (
        <div className="flex flex-col gap-5 text-white">
        {!videoUrl ? (
            previewSource ? (
            <img src={previewSource} alt="Preview" className="h-full w-full rounded-md object-cover" />
            ) : (
            <p className="text-white">Video is not available.</p>
            )
        ) : (
            <div className="relative">
            <video
                ref={playerRef}
                src={videoUrl}
                controls
                width="100%"
                height="auto"
                onEnded={() => setVideoEnded(true)}
                onError={(e) => console.log("Video Error:", e)}
                className="rounded-md"
            />

            {videoEnded && (
                <div className="absolute inset-0 z-[100] grid place-content-center bg-gradient-to-t from-black via-black/70 via-30% to-transparent text-white font-inter">
                {!completedLectures.includes(subSectionId) && (
                    <IconBtn 
                    disabled={loading}
                    onClick={
                        handleLectureCompletion}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                    customClasses="text-xl max-w-max px-4 mx-auto"
                    />
                )}
                <button
                disabled={loading}
                onClick={() => {
                    // console.log("Replay clicked");
                    // console.log("Player Ref:", playerRef.current);
                    if (playerRef.current) {
                    playerRef.current.pause();
                    playerRef.current.currentTime = 0;
                    playerRef.current.play();
                    setVideoEnded(false);
                    }
                }}
                className="text-xl max-w-max px-4 mx-auto mt-2 bg-richblack-800 rounded-md py-[8px] px-[20px] text-richblack-5 font-semibold"
                >
                Replay
                </button>

                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                    {!isFirstVideo() && (
                    <button
                        disabled={loading}
                        onClick={goToPrevVideo}
                        className="cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5"
                    >
                        Prev
                    </button>
                    )}
                    {!isLastVideo() && (
                    <button
                        disabled={loading}
                        onClick={goToNextVideo}
                        className="cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5"
                    >
                        Next
                    </button>
                    )}
                </div>
                </div>
            )}
            </div>
        )}

        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        <p className="pt-2 pb-6">{description}</p>
        </div>
    );
    };

    export default VideoDetails;
