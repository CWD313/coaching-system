import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function NewStudent() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);

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
      <h1>Add New Student</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Class:</label><br />
          <input 
            value={className}
            onChange={(e) => setClassName(e.target.value)} 
            required
          />
        </div>

        <div>
          <label>Phone:</label><br />
          <input 
            value={phone}
            onChange={(e) => setPhone(e.target.value)} 
            required
          />
        </div>

        <div>
          <label>Photo (optional):</label><br />
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        <br />
        <button type="submit">Save Student</button>
      </form>
    </div>
  );
}
