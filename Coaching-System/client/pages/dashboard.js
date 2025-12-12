import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);

    // Fetch Dashboard Summary
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
            .get(`${process.env.NEXT_PUBLIC_API}/api/dashboard/summary`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setData(res.data))
            .catch((err) => console.error("API Error:", err));
    }, []);

    // Format Attendance Chart Data
    useEffect(() => {
        if (data?.monthlyAttendanceSummary) {
            const formatted = data.monthlyAttendanceSummary.map((item) => ({
                monthYear: `${item._id.month}/${item._id.year}`,
                present: item.totalPresent ?? 0,
                absent: item.totalAbsent ?? 0,
            }));
            setAttendanceData(formatted);
        }
    }, [data]);

    // Logo Upload Handler
    const uploadLogo = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("logo", file);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/api/coaching/upload-logo`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // Upload के बाद नया डेटा फेच कर लो
            setData((prev) => ({
                ...prev,
                coaching: {
                    ...prev.coaching,
                    logoUrl: response.data.logoUrl,
                },
            }));
        } catch (err) {
            console.error("Logo Upload Error:", err);
        }
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>

            {/* Logo Upload */}
            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={uploadLogo}
            />

            {/* Coaching Info */}
            <div>
                {data.coaching?.logoUrl && (
                    <img
                        src={data.coaching.logoUrl}
                        alt="Logo"
                        style={{ width: 80, height: 80, borderRadius: 10 }}
                    />
                )}
                <h2>{data.coaching?.name}</h2>
            </div>

            <h3>Total Students: {data.totalStudents ?? 0}</h3>

            {/* Chart Section */}
            <h3>Monthly Attendance Summary</h3>
            <BarChart width={600} height={300} data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthYear" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#82ca9d" name="Present" />
                <Bar dataKey="absent" fill="#ff6961" name="Absent" />
            </BarChart>

            {/* Recent Tests */}
            <h3>Recent Tests</h3>
            <ul>
                {data.recentTests?.map((test) => (
                    <li key={test._id}>
                        {test.name ?? "Unnamed"} —{" "}
                        {test.date
                            ? new Date(test.date).toLocaleDateString()
                            : "N/A"}
                    </li>
                ))}
            </ul>

            {/* Plan Info */}
            <h3>Plan Status: {data.plan?.status}</h3>
            <p>
                Expiry:{" "}
                {data.plan?.expiryDate
                    ? new Date(data.plan.expiryDate).toDateString()
                    : "N/A"}
            </p>

            {data.plan?.status !== "active" && (
                <button onClick={() => (window.location.href = "/subscription")}>
                    Subscribe / Renew
                </button>
            )}
        </div>
    );
}
