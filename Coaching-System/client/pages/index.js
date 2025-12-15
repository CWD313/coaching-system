import React from 'react';
import Link from 'next/link';

// API कॉल के लिए async फ़ंक्शन
const exportStudents = async () => {
  // सुनिश्चित करें कि यह फ़ंक्शन केवल Client-side पर चलता है
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");

    // Fetch API का उपयोग करें
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/exports/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // फ़ाइल डाउनलोड लॉजिक
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.xlsx";
    a.click();
    window.URL.revokeObjectURL(url); // मेमोरी साफ़ करें
  }
};

export default function Home() {
  return (
    // JSX को return के अंदर एक सिंगल पैरेंट एलिमेंट में रैप किया गया है
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* 1. Login/Register Section */}
      <div className="p-8 border rounded shadow">
        <h1 className="text-2xl font-bold">Coaching System</h1>
        <p className="mt-4">Admin Login / Register</p>
        <div className="mt-4">
          <Link href="/login" legacyBehavior>
            <a className="text-blue-600">Login</a>
          </Link>
        </div>
      </div>

      {/* 2. Student Actions Section */}
      {/* मैंने आपकी स्टाइलिंग को Tailwind CSS का उपयोग करके एक कंटेनर में डाल दिया है */}
      <div className="mt-8 p-4 border rounded shadow flex space-x-4">
        
        {/* Add Student Link */}
        <Link href="/students/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Student
          </button>
        </Link>

        {/* Export Students (Fetch API - Asynchronous) */}
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={exportStudents}
        >
          Export Students (Excel)
        </button>

        {/* आपका दूसरा Export बटन (Legacy window.location.href approach) */}
        {/* यदि आप ऊपर वाला बटन उपयोग कर रहे हैं, तो इसकी आवश्यकता नहीं है, लेकिन यहाँ शामिल किया गया है */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = `${process.env.NEXT_PUBLIC_API}/api/exports/students?token=${localStorage.getItem("token")}`;
            }
          }}
        >
          Export Students (Legacy)
        </button>

      </div>
    </div>
  );
}
