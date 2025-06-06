import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_API_URL } from '../utils/constants';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
        withCredentials: true,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(`data: `, data);
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-blue-500 mb-6">LinkShrinker Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 mb-6 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don&apos;t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Signup</Link>
        </p>
      </div>
    </div>
  );
}
