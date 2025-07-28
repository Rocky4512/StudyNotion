import "./App.css";
import { Route, Routes } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";

// Auth
import OpenRoute from "./components/core/auth/OpenRoute";
import PrivateRoute from "./components/core/auth/PrivateRoute";

// Dashboard Components
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/settings/Settings";
import Cart from "./components/core/Dashboard/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import MyCourses from "./components/core/Dashboard/MyCourses";
import AddCourse from "./components/core/Dashboard/AddCourse";

// Misc
import Navbar from "./components/common/Navbar";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";



function App() {
    const { user } = useSelector((state) => state.profile);

    return (
        <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar />

        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="catalog/:catalogName" element={<Catalog />} />
            <Route path="courses/:courseId" element={<CourseDetails />} />
            
            <Route
            path="/login"
            element={
                <OpenRoute>
                <Login />
                </OpenRoute>
            }
            />
            <Route
            path="/signup"
            element={
                <OpenRoute>
                <Signup />
                </OpenRoute>
            }
            />
            <Route
            path="/forgot-password"
            element={
                <OpenRoute>
                <ForgotPassword />
                </OpenRoute>
            }
            />
            <Route
            path="/update-password/:id"
            element={
                <OpenRoute>
                <UpdatePassword />
                </OpenRoute>
            }
            />
            <Route
            path="/verify-email"
            element={
                <OpenRoute>
                <VerifyEmail />
                </OpenRoute>
            }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Private Routes */}
            <Route
            path="/dashboard"
            element={
                <PrivateRoute>
                <Dashboard />
                </PrivateRoute>
            }
            >
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="settings" element={<Settings />} />

            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                <Route path="cart" element={<Cart />} />
                <Route path="enrolled-courses" element={<EnrolledCourses />} />
                </>
            )}

            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                <Route path="instructor" element={<Instructor />} />
                <Route path="add-course" element={<AddCourse />} />
                <Route path="my-courses" element={<MyCourses />} />
                <Route path="edit-course/:courseId" element={<EditCourse />} />
                </>
            )}
            </Route>

        <Route
            path="view-course/:courseId"
            element={
                <PrivateRoute>
                <ViewCourse />
                </PrivateRoute>
            }
            >
            <Route
                path="section/:sectionId/sub-section/:subSectionId"
                element={
                user?.accountType === ACCOUNT_TYPE.STUDENT
                    ? <VideoDetails />
                    : <div className="text-white p-4">You are not authorized to view this content.</div>
                }
            />
            </Route>



            {/* Fallback */}
            <Route path="*" element={<Error />} />
        </Routes>
        </div>
    );
}

export default App;
