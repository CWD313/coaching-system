import { useEffect, useState } from "react";
import axios from "axios";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStudents(res.data.students);

        // initialize attendance object
        const init = {};
        res.data.students.forEach((s) => {
          init[s._id] = true; // default = Present
        });
        setAttendance(init);
      })
      .catch((err) => console.log(err));
  }, []);

  const toggleStatus = (id) => {
    setAttendance({
      ...attendance,
      [id]: !attendance[id],
    });
  };

  const submitAttendance = async () => {
    if (!date) return alert("Select a date first!");

    const token = localStorage.getItem("token");

    const entries = students.map((s) => ({
      studentId: s._id,
      status: attendance[s._id] ? "present" : "absent",
    }));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/attendance`,
        {
          date,
          entries,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Attendance saved!");
    } catch (err) {
      console.log(err);
      alert("Error submitting attendance");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Attendance</h1>

      {/* DATE INPUT */}
      <label>Select Date:</label>
      <br />
      <input 
        type="date" 
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <br /><br />

      {/* STUDENT GRID */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {students.map((s) => (
          <div
            key={s._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "180px",
              borderRadius: "10px",
              textAlign: "center",
              background: attendance[s._id] ? "#d4ffd4" : "#ffd4d4",
            }}
          >
            <h4>{s.name}</h4>
            <p>{s.class}</p>

            {s.photoUrl && (
              <img 
                src={s.photoUrl} 
                width="60" 
                height="60"
                style={{ borderRadius: "50%" }}
              />
            )}

            <br />
            <button onClick={() => toggleStatus(s._id)}>
              {attendance[s._id] ? "Present" : "Absent"}
            </button>
          </div>
        ))}
      </div>

      <br /><br />
      <button onClick={submitAttendance} style={{ padding: "10px 20px" }}>
        Save Attendance
      </button>
    </div>
  );
}
