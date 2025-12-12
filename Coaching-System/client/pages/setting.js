import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Settings() {
  const [logo, setLogo] = useState(null);
  const [profile, setProfile] = useState(null);

  // Fetch current profile (to show existing logo)
  useEffect(() => {
    api
      .get("/api/auth/profile")
      .then((res) => setProfile(res.data.admin))
      .catch((err) => console.log(err));
  }, []);

  const uploadLogo = async () => {
    if (!logo) return alert("Please select a logo file");

    const formData = new FormData();
    formData.append("file", logo);

    try {
      await api.post("/api/uploads/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Logo updated!");

      // Refresh profile
      const res = await api.get("/api/auth/profile");
      setProfile(res.data.admin);

    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Settings</h1>

      <h3>Coaching Logo</h3>

      {profile?.coaching?.logoUrl && (
        <img
          src={profile.coaching.logoUrl}
          width={100}
          height={100}
          style={{ borderRadius: 10, marginBottom: 10 }}
        />
      )}

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
        />
      </div>

      <br />

      <button onClick={uploadLogo}>Upload Logo</button>
    </div>
  );
}
