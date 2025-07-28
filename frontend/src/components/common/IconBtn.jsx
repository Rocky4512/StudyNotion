export default function IconBtn({
    text,
    onClick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
    }) {
        return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex items-center ${
            outline ? "border border-ricyellow-50 bg-transparent" : "bg-richyellow-50"
            } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
            type={type}
        >
            {children ? (
            <>
                <span className={`${outline && "text-richyellow-50"}`}>{text}</span>
                {children}
            </>
            ) : (
            text
            )}
        </button>
        )
}