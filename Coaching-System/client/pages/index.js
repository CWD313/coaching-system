<button
  onClick={() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API}/api/exports/students?token=${localStorage.getItem("token")}`;
  }}
>
  Export Students (Excel)
</button>
import React from 'react'

import Link from 'next/link'
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 border rounded shadow">
        <h1 className="text-2xl font-bold">Coaching System</h1>
        <p className="mt-4">Admin Login / Register</p>
        <div className="mt-4">
          <Link href="/login"><a className="text-blue-600">Login</a></Link>
        </div>
      </div>
    </div>
  )
}
<div style={{ marginBottom: "15px" }}>
  <Link href="/students/new">
    <button>Add Student</button>
  </Link>

  <button
    style={{ marginLeft: "10px" }}
    onClick={() => {
      window.location.href = `${process.env.NEXT_PUBLIC_API}/api/exports/students?token=${localStorage.getItem("token")}`;
    }}
  >
    Export Students (Excel)
  </button>
</div>
const exportStudents = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/exports/students`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "students.xlsx";
  a.click();
};
  <button style={{ marginLeft: "10px" }} onClick={exportStudents}>
    Export Students (Excel)
  </button>