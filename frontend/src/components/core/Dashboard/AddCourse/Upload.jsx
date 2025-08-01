import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
// import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

export default function Upload({
    name,
    label,
    // register,
    setValue,
    errors,
    video = false,
    viewData = null,
    editData = null,
    }) {
    //   const { course } = useSelector((state) => state.course);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSource, setPreviewSource] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (viewData) setPreviewSource(viewData);
        else if (editData) setPreviewSource(editData);
    }, [viewData, editData]);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
        previewFile(file);
        setSelectedFile(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: !video ? { "image/*": [".jpeg", ".jpg", ".png"] } : { "video/*": [".mp4"] },
        onDrop,
    });

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        setPreviewSource(reader.result);
        };
    };

    useEffect(() => {
        setValue(name, selectedFile);
    }, [selectedFile, setValue, name]);

    const handleCancel = () => {
        setPreviewSource("");
        setSelectedFile(null);
        setValue(name, null);
        if (inputRef.current) {
        inputRef.current.value = null;
        }
    };

    return (
        <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor={name}>
            {label} {!viewData && <sup className="text-richpink-200">*</sup>}
        </label>
        <div
            className={`${
            isDragActive ? "bg-richblack-600" : "bg-richblack-700"
            } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
            onClick={() => {
            if (!previewSource) inputRef.current?.click();
            }}
        >
            {previewSource ? (
            <div className="flex w-full flex-col p-6">
                {!video ? (
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />
                ) : (
                <div className="relative pt-[56.25%]">
                    <ReactPlayer
                    url={previewSource}
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                    />
                </div>
                )}
                {!viewData && (
                <button
                    type="button"
                    onClick={handleCancel}
                    className="mt-3 text-richblack-400 underline"
                >
                    Cancel
                </button>
                )}
            </div>
            ) : (
            <div className="flex w-full flex-col items-center p-6" {...getRootProps()}>
                <input {...getInputProps()} ref={inputRef} />
                <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                <FiUploadCloud className="text-2xl text-richyellow-50" />
                </div>
                <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                <span className="font-semibold text-richyellow-50">Browse</span> a file
                </p>
                <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024x576</li>
                </ul>
            </div>
            )}
        </div>
        {errors[name] && (
            <span className="ml-2 text-xs tracking-wide text-richpink-200">{label} is required</span>
        )}
        </div>
    );
}
