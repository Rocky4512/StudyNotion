import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
    name,
    label,
    register,
    setValue,
    errors,
    }) {
    const { editCourse, course } = useSelector((state) => state.course)
    const [requirement, setRequirement] = useState("")
    const [requirementsList, setRequirementsList] = useState([])

    useEffect(() => {
        if (editCourse) {
        setRequirementsList(course?.instructions)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setValue(name, requirementsList)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requirementsList])

    const handleAddRequirement = () => {
        if (requirement) {
        setRequirementsList([...requirementsList, requirement])
        setRequirement("")
        }
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirements = [...requirementsList]
        updatedRequirements.splice(index, 1)
        setRequirementsList(updatedRequirements)
    }

    return (
        <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor={name}>
            {label} <sup className="text-richpink-200">*</sup>
        </label>
        <div className="flex flex-col items-start space-y-2">
            <input
            type="text"
            id={name}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full"
            />
            <button
            type="button"
            onClick={handleAddRequirement}
            className="font-semibold text-richyellow-50"
            >
            Add
            </button>
        </div>
        {requirementsList.length > 0 && (
            <ul className="mt-2 list-inside list-disc">
            {requirementsList.map((requirement, index) => (
                <li key={index} className="flex items-center text-richblack-5">
                <span>{requirement}</span>
                <button
                    type="button"
                    className="ml-2 text-xs text-pure-greys-300 "
                    onClick={() => handleRemoveRequirement(index)}
                >
                    clear
                </button>
                </li>
            ))}
            </ul>
        )}
        {errors[name] && (
            <span className="ml-2 text-xs tracking-wide text-richpink-200">
            {label} is required
            </span>
        )}
        </div>
    )
}