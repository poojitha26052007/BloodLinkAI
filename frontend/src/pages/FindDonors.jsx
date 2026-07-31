import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function FindDonors() {
    const navigate = useNavigate();

    const [bloodGroup, setBloodGroup] = useState("");
    const [city, setCity] = useState("");

    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const searchDonors = async (e) => {
        e.preventDefault();

        setError("");
        setDonors([]);
        setSearched(false);

        if (!bloodGroup || !city) {
            setError("Please select blood group and enter city.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.get("/donors/match", {
                params: {
                    blood_group: bloodGroup,
                    city: city
                }
            });

            console.log("Donor Search Response:", response.data);

            setDonors(response.data.donors || []);
            setSearched(true);

        } catch (error) {
            console.error(
                "Find Donors Error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Unable to search donors."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card donor-search-card">

                <div className="logo">
                    🩸
                </div>

                <h1>Find Blood Donors</h1>

                <p className="subtitle">
                    Find available donors near you
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={searchDonors}>

                    <div className="form-group">
                        <label>Blood Group</label>

                        <select
                            value={bloodGroup}
                            onChange={(e) =>
                                setBloodGroup(e.target.value)
                            }
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

                    <div className="form-group">
                        <label>City / Location</label>

                        <input
                            type="text"
                            placeholder="Example: Guntur"
                            value={city}
                            onChange={(e) =>
                                setCity(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Searching..."
                            : "Search Donors"}
                    </button>

                </form>

                {searched && (
                    <div className="donor-results">

                        <h2>
                            {donors.length > 0
                                ? `${donors.length} Donor(s) Found`
                                : "No Donors Found"}
                        </h2>

                        {donors.map((donor) => (
                            <div
                                className="feature-card"
                                key={donor.id}
                            >
                                <h3>
                                    👤 {donor.full_name}
                                </h3>

                                <p>
                                    🩸 Blood Group:{" "}
                                    <strong>
                                        {donor.blood_group}
                                    </strong>
                                </p>

                                <p>
                                    📍 City:{" "}
                                    {donor.city}
                                </p>

                                <p>
                                    📞 Phone:{" "}
                                    {donor.phone}
                                </p>

                                <p>
                                    📧 Email:{" "}
                                    {donor.email || "Not available"}
                                </p>

                                <p>
                                    🟢 Available
                                </p>
                            </div>
                        ))}

                    </div>
                )}

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

export default FindDonors;