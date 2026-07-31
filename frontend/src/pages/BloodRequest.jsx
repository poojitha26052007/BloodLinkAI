import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function BloodRequest() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        patient_name: "",
        blood_group: "",
        phone: "",
        city: "",
        hospital: "",
        urgency: "critical"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await API.post(
                "/requests",
                formData
            );

            console.log("Blood Request Response:", response.data);

            setSuccess(
                response.data.message ||
                "Blood request created successfully!"
            );

            setFormData({
                patient_name: "",
                blood_group: "",
                phone: "",
                city: "",
                hospital: "",
                urgency: "critical"
            });

        } catch (error) {
            console.error(
                "Blood Request Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to create blood request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="logo">
                    🩸
                </div>

                <h1>Emergency Blood Request</h1>

                <p className="subtitle">
                    Request blood during an emergency
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Patient Name */}
                    <div className="form-group">
                        <label>Patient Name</label>

                        <input
                            type="text"
                            name="patient_name"
                            placeholder="Enter patient name"
                            value={formData.patient_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Blood Group */}
                    <div className="form-group">
                        <label>Blood Group</label>

                        <select
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Blood Group
                            </option>

                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label>Phone Number</label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter contact number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* City */}
                    <div className="form-group">
                        <label>City / Location</label>

                        <input
                            type="text"
                            name="city"
                            placeholder="Example: Guntur"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Hospital */}
                    <div className="form-group">
                        <label>Hospital</label>

                        <input
                            type="text"
                            name="hospital"
                            placeholder="Hospital name"
                            value={formData.hospital}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Urgency */}
                    <div className="form-group">
                        <label>Urgency</label>

                        <select
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleChange}
                            required
                        >
                            <option value="critical">
                                Critical
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="medium">
                                Medium
                            </option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Request..."
                            : "Create Blood Request"}
                    </button>

                </form>

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

export default BloodRequest;