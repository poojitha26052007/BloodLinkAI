import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="logo">
                    👤
                </div>

                <h1>My Profile</h1>

                <p className="subtitle">
                    Your BloodLink AI account details
                </p>

                <div className="profile-info">

                    <div className="profile-item">
                        <span>👤 Name</span>
                        <strong>{user?.name || "Not available"}</strong>
                    </div>

                    <div className="profile-item">
                        <span>📧 Email</span>
                        <strong>{user?.email || "Not available"}</strong>
                    </div>

                    <div className="profile-item">
                        <span>🏫 Department</span>
                        <strong>
                            {user?.department || "Not available"}
                        </strong>
                    </div>

                    <div className="profile-item">
                        <span>📚 Year</span>
                        <strong>
                            {user?.year || "Not available"}
                        </strong>
                    </div>

                    <div className="profile-item">
                        <span>🎓 Role</span>
                        <strong>
                            {user?.role || "Not available"}
                        </strong>
                    </div>

                </div>

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default Profile;