import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
    addCourseDetails,
    editCourseDetails,
    fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";

import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementField";

export default function CourseInformationForm() {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
} = useForm();

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { course, editCourse } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    // Fetch categories and initialize form in edit mode
    useEffect(() => {
        const getCategories = async () => {
        setLoading(true);
        const categories = await fetchCourseCategories();
        if (categories.length > 0) {
            setCourseCategories(categories);
        }
        setLoading(false);
        };

        getCategories();

        if (editCourse && course) {
        // Populate form values in edit mode
        setValue("courseTitle", course.courseName);
        setValue("courseShortDesc", course.courseDescription);
        setValue("coursePrice", course.price);
        setValue("courseTags", course.tag || []);
        setValue("courseBenefits", course.whatYouWillLearn);
        setValue("courseCategory", course.category?._id || "");
        setValue("courseRequirements", course.instructions || []);
        setValue("courseImage", course.thumbnail || "");
        }
    }, [editCourse, course, setValue]);

    // Reset form when component unmounts or course changes to avoid stale data
    useEffect(() => {
        return () => {
        reset();
        setLoading(false);
        };
    }, [reset]);

    // Check if form data has changed compared to course data (for edit)
    const isFormUpdated = () => {
        const currentValues = getValues();
        if (!editCourse || !course) return false;

        // Compare strings and arrays appropriately
        const tagsChanged =
        Array.isArray(currentValues.courseTags) &&
        Array.isArray(course.tag) &&
        currentValues.courseTags.toString() !== course.tag.toString();

        const requirementsChanged =
        Array.isArray(currentValues.courseRequirements) &&
        Array.isArray(course.instructions) &&
        currentValues.courseRequirements.toString() !== course.instructions.toString();

        return (
        currentValues.courseTitle !== course.courseName ||
        currentValues.courseShortDesc !== course.courseDescription ||
        Number(currentValues.coursePrice) !== Number(course.price) ||
        tagsChanged ||
        currentValues.courseBenefits !== course.whatYouWillLearn ||
        currentValues.courseCategory !== course.category?._id ||
        requirementsChanged ||
        currentValues.courseImage !== course.thumbnail
        );
    };

    const onSubmit = async (data) => {
        if (editCourse && course) {
        if (!isFormUpdated()) {
            toast.error("No changes made to the form");
            return;
        }

        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId", course._id);

        if (currentValues.courseTitle !== course.courseName) {
            formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
            formData.append("courseDescription", data.courseShortDesc);
        }
        if (Number(currentValues.coursePrice) !== Number(course.price)) {
            formData.append("price", data.coursePrice);
        }
        if (
            Array.isArray(currentValues.courseTags) &&
            Array.isArray(course.tag) &&
            currentValues.courseTags.toString() !== course.tag.toString()
        ) {
            formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
            formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory !== course.category?._id) {
            formData.append("category", data.courseCategory);
        }
        if (
            Array.isArray(currentValues.courseRequirements) &&
            Array.isArray(course.instructions) &&
            currentValues.courseRequirements.toString() !== course.instructions.toString()
        ) {
            formData.append("instructions", JSON.stringify(data.courseRequirements));
        }

        // Append thumbnail image only if changed and is a File object
        if (currentValues.courseImage !== course.thumbnail) {
            if (data.courseImage instanceof File) {
            formData.append("thumbnailImage", data.courseImage);
            }
            // If courseImage is a string (existing URL) and unchanged, skip appending
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);

        if (result) {
            dispatch(setStep(2));
            dispatch(setCourse(result));
        } else {
            toast.error("Error updating course details");
        }
        return;
        }

        // Case: Adding a new course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("tag", JSON.stringify(data.courseTags));
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("category", data.courseCategory);
        formData.append("status", COURSE_STATUS.DRAFT);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        if (data.courseImage instanceof File) {
        formData.append("thumbnailImage", data.courseImage);

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }
        }
        setLoading(true);


        const result = await addCourseDetails(formData, token);
        setLoading(false);

        if (result) {
        dispatch(setStep(2));
        dispatch(setCourse(result));
        } else {
        toast.error("Error adding new course");
        }
    };

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
        >
        {/* Course Title */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Course Title <sup className="text-richpink-200">*</sup>
            </label>
            <input
            id="courseTitle"
            placeholder="Enter Course Title"
            {...register("courseTitle", { required: "Course title is required" })}
            className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full"
            autoComplete="off"
            />
            {errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-richpink-200">
                {errors.courseTitle.message}
            </span>
            )}
        </div>

        {/* Course Short Description */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
            Course Short Description <sup className="text-richpink-200">*</sup>
            </label>
            <textarea
            id="courseShortDesc"
            placeholder="Enter Description"
            {...register("courseShortDesc", { required: "Course description is required" })}
            className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none resize-x-none min-h-[130px] w-full"
            />
            {errors.courseShortDesc && (
            <span className="ml-2 text-xs tracking-wide text-richpink-200">
                {errors.courseShortDesc.message}
            </span>
            )}
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="coursePrice">
            Course Price <sup className="text-richpink-200">*</sup>
            </label>
            <div className="relative">
            <input
                id="coursePrice"
                placeholder="Enter Course Price"
                {...register("coursePrice", {
                required: "Course price is required",
                valueAsNumber: true,
                pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: "Enter a valid price",
                },
                })}
                className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full !pl-12"
                inputMode="decimal"
            />
            <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
            </div>
            {errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-richpink-200">
                {errors.coursePrice.message}
            </span>
            )}
        </div>

        {/* Course Category */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseCategory">
            Course Category <sup className="text-richpink-200">*</sup>
            </label>
            <select
            {...register("courseCategory", { required: "Course category is required" })}
            defaultValue=""
            id="courseCategory"
            className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full"
            disabled={loading}
            >
            <option value="" disabled>
                Choose a Category
            </option>
            {!loading &&
                courseCategories.map((category) => (
                <option key={category._id} value={category._id}>
                    {category.name}
                </option>
                ))}
            </select>
            {errors.courseCategory && (
            <span className="ml-2 text-xs tracking-wide text-richpink-200">
                {errors.courseCategory.message}
            </span>
            )}
        </div>

        {/* Course Tags */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and press Enter"
            register={register}
            errors={errors}
            setValue={setValue}
        />

        {/* Course Thumbnail Image */}
        <Upload
            name="courseImage"
            label="Course Thumbnail"
            register={register}
            setValue={setValue}
            errors={errors}
            editData={editCourse ? course.thumbnail : null}
        />

        {/* Benefits of the course */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
            Benefits of the course <sup className="text-richpink-200">*</sup>
            </label>
            <textarea
            id="courseBenefits"
            placeholder="Enter benefits of the course"
            {...register("courseBenefits", { required: "Please enter course benefits" })}
            className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none resize-x-none min-h-[130px] w-full"
            />
            {errors.courseBenefits && (
            <span className="ml-2 text-xs tracking-wide text-richpink-200">
                {errors.courseBenefits.message}
            </span>
            )}
        </div>

        {/* Requirements/Instructions */}
        <RequirementsField
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            setValue={setValue}
            errors={errors}
        />

        {/* Next / Save Button */}
        <div className="flex justify-end gap-x-2">
            {editCourse && (
            <button
                type="button"
                onClick={() => dispatch(setStep(2))}
                disabled={loading}
                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
            >
                Continue Without Saving
            </button>
            )}
            <IconBtn disabled={loading} text={!editCourse ? "Next" : "Save Changes"}>
            <MdNavigateNext />
            </IconBtn>
        </div>
        </form>
    );
}
