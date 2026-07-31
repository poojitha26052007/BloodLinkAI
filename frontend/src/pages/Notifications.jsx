import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Notifications() {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // For testing:
    // Rahul Kumar donor ID = 4
    const donorId = 4;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/notifications/donor/${donorId}`
            );

            setNotifications(
                response.data.notifications || []
            );

        } catch (error) {

            console.error(
                "Notification Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load notifications."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchNotifications();
    }, []);


    const markAsRead = async (notificationId) => {

        try {

            await API.put(
                `/notifications/${notificationId}/read`
            );

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification.id === notificationId
                        ? {
                            ...notification,
                            is_read: true
                        }
                        : notification
                )
            );

        } catch (error) {

            console.error(
                "Mark Read Error:",
                error
            );

        }
    };


    return (
        <div className="auth-container">

            <div
                className="auth-card"
                style={{ maxWidth: "700px" }}
            >

                <div className="logo">
                    🔔
                </div>

                <h1>
                    Notifications
                </h1>

                <p className="subtitle">
                    Emergency blood request notifications
                </p>


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {loading && (
                    <p>
                        Loading notifications...
                    </p>
                )}


                {!loading &&
                    !error &&
                    notifications.length === 0 && (
                        <div className="success-message">
                            No notifications found.
                        </div>
                    )
                }


                {!loading &&
                    notifications.length > 0 && (

                    <div>

                        <p>
                            <strong>
                                {notifications.length}
                            </strong>{" "}
                            notification(s) found
                        </p>


                        {notifications.map(
                            (notification) => (

                            <div
                                key={notification.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    marginBottom: "15px",
                                    textAlign: "left",
                                    backgroundColor:
                                        notification.is_read
                                            ? "#f5f5f5"
                                            : "#fff5f5"
                                }}
                            >

                                <h3>
                                    🚨{" "}
                                    {notification.title}
                                </h3>

                                <p>
                                    {notification.message}
                                </p>

                                <p>
                                    <strong>
                                        Type:
                                    </strong>{" "}
                                    {notification.notification_type}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {notification.is_read
                                        ? "Read"
                                        : "Unread"}
                                </p>


                                {!notification.is_read && (

                                    <button
                                        type="button"
                                        className="primary-btn"
                                        onClick={() =>
                                            markAsRead(
                                                notification.id
                                            )
                                        }
                                    >
                                        Mark as Read
                                    </button>

                                )}

                            </div>

                        ))}

                    </div>

                )}


                <button
                    type="button"
                    className="secondary-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default Notifications;