    import { useState } from "react";
    import { Chart, registerables } from "chart.js";
    import { Bar } from "react-chartjs-2";

    Chart.register(...registerables);

    export default function InstructorChart({ courses }) {
    // State to keep track of the currently selected chart
    const [currChart, setCurrChart] = useState("students");

    const pastelColors = [
        "rgba(255, 179, 186, 0.7)", // Light Pink
        "rgba(255, 223, 186, 0.7)", // Peach
        "rgba(255, 255, 186, 0.7)", // Light Yellow
        "rgba(186, 255, 201, 0.7)", // Mint
        "rgba(186, 225, 255, 0.7)", // Baby Blue
        "rgba(210, 210, 255, 0.7)", // Lavender
        "rgba(255, 210, 245, 0.7)", // Light Magenta
        "rgba(204, 229, 255, 0.7)", // Soft Blue
        "rgba(255, 204, 229, 0.7)", // Light Rose
        "rgba(255, 204, 204, 0.7)", // Warm Blush
        "rgba(204, 255, 229, 0.7)", // Seafoam
        "rgba(255, 255, 204, 0.7)", // Butter Yellow
        "rgba(204, 255, 255, 0.7)", // Powder Blue
        "rgba(255, 204, 255, 0.7)", // Soft Orchid
        "rgba(229, 204, 255, 0.7)", // Lilac
        "rgba(204, 229, 255, 0.7)", // Icy Blue
        "rgba(229, 255, 204, 0.7)", // Green Tea
        "rgba(255, 229, 204, 0.7)", // Apricot
        "rgba(204, 204, 255, 0.7)", // Periwinkle
        "rgba(255, 204, 153, 0.7)", // Pastel Orange
        "rgba(153, 255, 204, 0.7)", // Spearmint
        "rgba(204, 255, 153, 0.7)", // Pastel Green
        "rgba(255, 153, 204, 0.7)", // Cotton Candy
        "rgba(153, 204, 255, 0.7)", // Sky Blue
        "rgba(255, 255, 153, 0.7)", // Banana
        "rgba(204, 255, 255, 0.7)", // Glacier
        "rgba(229, 255, 255, 0.7)", // Cloud Blue
        "rgba(255, 204, 255, 0.7)", // Rosewater
        "rgba(229, 229, 255, 0.7)", // Soft Lavender
        "rgba(204, 255, 229, 0.7)", // Soft Mint
    ];

    const shuffleArray = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const randomColors = shuffleArray(pastelColors).slice(0, courses.length);

    // Data for the chart displaying student information
    const chartDataStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
        {
            label: "Students Enrolled",
            data: courses.map((course) => course.totalStudentsEnrolled),
            backgroundColor: randomColors,
            borderColor: randomColors.map((c) => c.replace("0.7", "1")),
            borderWidth: 2,
            categoryPercentage: 0.6, // space each bar occupies in category
            barPercentage: 0.5,
        },
        ],
    };

    // Data for the chart displaying income information
    const chartIncomeData = {
        labels: courses.map((course) => course.courseName),
        datasets: [
        {
            label: "Income Generated (₹)",
            data: courses.map((course) => course.totalAmountGenerated),
            backgroundColor: randomColors,
            borderColor: randomColors.map((c) => c.replace("0.7", "1")),
            borderWidth: 2,
            categoryPercentage: 0.6, // space each bar occupies in category
            barPercentage: 0.5,
        },
        ],
    };

    // Options for the chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: false,
        },
        },
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: currChart === "students" ? "Students Enrolled" : "Income Generated ( ₹ ) ", // ✅ Y-axis label
            color: "#FFFFFF", // adjust for theme
            font: {
                size: 14,
                weight: "bold",
            },
            },
            ticks: {
            color: "#FFFFFF",
            padding: 10,
            precision: 0,
            },
        },
        x: {
            beginAtZero: true,
            title: {
            display: true,
            text: "Published Courses", // ✅ Y-axis label
            color: "#FFFFFF", // adjust for theme
            font: {
                size: 14,
                weight: "bold",
            },
            },
            ticks: {
            color: "#FFFFFF",
            padding: 10,
            precision: 0,
            },
        },
        },
    };

    return (
        <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Visualize</p>
        <div className="space-x-4 font-semibold">
            {/* Button to switch to the "students" chart */}
            <button
            onClick={() => setCurrChart("students")}
            className={`rounded-sm p-1 px-3 transition-all duration-200 cursor-pointer ${
                currChart === "students"
                ? "bg-richblack-700 text-richyellow-50"
                : "text-richyellow-400"
            }`}
            >
            Students
            </button>
            {/* Button to switch to the "income" chart */}
            <button
            onClick={() => setCurrChart("income")}
            className={`rounded-sm p-1 px-3 transition-all duration-200 cursor-pointer ${
                currChart === "income"
                ? "bg-richblack-700 text-richyellow-50"
                : "text-richyellow-400"
            }`}
            >
            Income
            </button>
        </div>
        <div className="relative mx-auto h-[300px] w-full max-w-[700px]">
            {/* Render the Pie chart based on the selected chart */}
            <Bar
            data={currChart === "students" ? chartDataStudents : chartIncomeData}
            options={options}
            />
        </div>
        </div>
    );
    }