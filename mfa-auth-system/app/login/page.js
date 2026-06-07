"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Login failed");
      return;
    }

    if (data.requireOTP) {
      localStorage.setItem("mfa_email", data.email);
      window.location.href = "/verify-otp";
      return;
    }

    localStorage.setItem("token", data.token);
    document.cookie = `token=${data.token}; path=/; max-age=86400`;
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Login
        </h1>

        <p className="mt-2 text-center text-slate-600">
          MFA Authentication System
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
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

          <button className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">
            Login
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center font-semibold text-red-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-slate-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-bold text-blue-600">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}