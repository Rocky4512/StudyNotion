import React from "react";

const Stats = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
];

const StatsComponent = () => {
    return (
        <div className="bg-richblack-700 h-45">
        {/* Stats */}
        <div className="flex flex-col gap-10 justify-between w-11/12 max-w-[1260px] text-white mx-auto h-[100%]">
            <div className="flex justify-evenly items-center text-center h-[100%]">
            {Stats.map((data, index) => {
                return (
                <div className="flex flex-col py-10" key={index}>
                    <h1 className="text-[30px] font-bold text-richblack-5">
                    {data.count}
                    </h1>
                    <h2 className="font-semibold text-[16px] text-richblack-500 tracking-wider">
                    {data.label}
                    </h2>
                </div>
                );
            })}
            </div>
        </div>
        </div>
    );
};

export default StatsComponent;