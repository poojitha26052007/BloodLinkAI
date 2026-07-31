import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BloodRequest from "./pages/BloodRequest";
import FindDonors from "./pages/FindDonors";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";


function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="dashboard">

            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <div>
                    <h1>🩸 BloodLink AI</h1>

                    <p>
                        Emergency Blood Donation Network
                    </p>
                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>


            {/* ================= WELCOME ================= */}

            <div className="welcome-card">

                <h2>
                    Welcome, {user?.name || "User"}
                </h2>

                <p>
                    Find blood donors quickly during
                    emergencies.
                </p>

            </div>


            {/* ================= FEATURES ================= */}

            <div className="dashboard-grid">

                {/* Emergency Blood Request */}

                <div
                    className="feature-card emergency"
                    onClick={() =>
                        navigate("/blood-request")
                    }
                >

                    <div className="feature-icon">
                        🩸
                    </div>

                    <h3>
                        Emergency Blood Request
                    </h3>

                    <p>
                        Create a blood request and
                        find matching donors.
                    </p>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/blood-request");
                        }}
                    >
                        Create Request →
                    </button>

                </div>


                {/* Find Donors */}

                <div
                    className="feature-card"
                    onClick={() =>
                        navigate("/find-donors")
                    }
                >

                    <div className="feature-icon">
                        👥
                    </div>

                    <h3>
                        Find Donors
                    </h3>

                    <p>
                        Find available donors based
                        on blood group and location.
                    </p>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/find-donors");
                        }}
                    >
                        Find Donors →
                    </button>

                </div>


                {/* Notifications */}

                <div
                    className="feature-card"
                    onClick={() =>
                        navigate("/notifications")
                    }
                >

                    <div className="feature-icon">
                        🔔
                    </div>

                    <h3>
                        Notifications
                    </h3>

                    <p>
                        View emergency blood
                        notifications.
                    </p>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/notifications");
                        }}
                    >
                        View Notifications →
                    </button>

                </div>


                {/* My Profile */}

                <div
                    className="feature-card"
                    onClick={() =>
                        navigate("/profile")
                    }
                >

                    <div className="feature-icon">
                        👤
                    </div>

                    <h3>
                        My Profile
                    </h3>

                    <p>
                        View your BloodLink AI
                        account details.
                    </p>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/profile");
                        }}
                    >
                        View Profile →
                    </button>

                </div>

            </div>


            {/* ================= ACCOUNT INFORMATION ================= */}

            <div className="user-info">

                <h3>
                    Account Information
                </h3>

                <p>
                    <strong>Email:</strong>{" "}
                    {user?.email || "Not available"}
                </p>

                <p>
                    <strong>Department:</strong>{" "}
                    {user?.department || "Not available"}
                </p>

                <p>
                    <strong>Year:</strong>{" "}
                    {user?.year || "Not available"}
                </p>

                <p>
                    <strong>Role:</strong>{" "}
                    {user?.role || "Not available"}
                </p>

            </div>

        </div>
    );
}


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* ================= DEFAULT ================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* ================= AUTH ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================= DASHBOARD ================= */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* ================= BLOOD REQUEST ================= */}

                <Route
                    path="/blood-request"
                    element={<BloodRequest />}
                />


                {/* ================= FIND DONORS ================= */}

                <Route
                    path="/find-donors"
                    element={<FindDonors />}
                />


                {/* ================= NOTIFICATIONS ================= */}

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />


                {/* ================= PROFILE ================= */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />


                {/* ================= UNKNOWN ROUTE ================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;