import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function submit(e){
    e.preventDefault();
    try{
      // --------------------- FIX: 404 Error Solved ---------------------
      // 1. Backend URL (NEXT_PUBLIC_API) का उपयोग किया जा रहा है।
      // 2. API पाथ को अनुमानित सही Backend पाथ '/api/users/login' में बदला गया है।
      //    (हमने app.js में राउटिंग को app.use("/api/users", userRouter); के लिए सेट किया था)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/users/login`, { email, password });
      // -----------------------------------------------------------------

      // store token and redirect
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    }catch(err){
      // बेहतर त्रुटि प्रबंधन (error handling) के लिए console.error जोड़ें
      console.error("Login failed:", err);
      alert(err.response?.data?.error || 'Login Error: Check network or credentials.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="p-6 border rounded">
        <h2 className="text-xl mb-4">Admin Login</h2>
        <input className="border p-2 w-64 mb-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="border p-2 w-64 mb-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  )
}
