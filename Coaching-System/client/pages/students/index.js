import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudents(res.data.students))
      .catch((err) => console.log(err));
  }, []);

  const deleteStudent = async (id) => {
    if (!confirm("Delete this student?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/api/students/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from UI
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Students</h1>

      <Link href="/students/new">
        <button>Add Student</button>
      </Link>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Phone</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>{s.phone}</td>

              <td>
                {s.photoUrl ? (
                  <img src={s.photoUrl} width="40" height="40" />
                ) : (
                  "No Photo"
                )}
              </td>

              <td>
                <Link href={`/students/${s._id}`}>
                  <button>Edit</button>
                </Link>

                <button onClick={() => deleteStudent(s._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
