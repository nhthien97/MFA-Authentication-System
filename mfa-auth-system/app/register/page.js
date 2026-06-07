"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Register
        </h1>

        <p className="mt-2 text-center text-slate-600">
          Create your secure account
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-blue-600"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-blue-600"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700">
            Register
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center font-semibold text-blue-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="font-bold text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}