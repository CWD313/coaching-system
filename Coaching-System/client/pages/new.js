<input
  type="file"
  accept="image/jpeg, image/png"
  onChange={(e) => setPhoto(e.target.files[0])}
/>
const [photo, setPhoto] = useState(null);
import axios from "axios";
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function NewStudent() {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const router = useRouter();   
    const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      // 1) Create Student
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/students`,
        {
          name,
          class: className,
            phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
        const studentId = res.data.student._id;
        // 2) Upload Photo (Optional)
        if (photo) {
        const formData = new FormData();
        formData.append("file", photo);
        await axios.post(
          `${process.env.NEXT_PUBLIC_API}/api/uploads/student-photo/${studentId}`,
          formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        }
        alert("Student created!");
        router.push("/students");
    } catch (err) {
      console.log(err);
      alert("Error creating student");
    }
    };
    return (
    <div style={{ padding: 20 }}>
        <h1>New Student</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Class:</label>
                <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Phone:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Photo:</label>
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(e) => setPhoto(e.target.files[0])}
                />
            </div>
            <br />
            <button type="submit">Create Student</button>
        </form>
    </div>
  );
}
    