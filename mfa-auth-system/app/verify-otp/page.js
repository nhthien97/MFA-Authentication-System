"use client";

import { useEffect, useState } from "react";

export default function VerifyOTPPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("mfa_email");

    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  async function handleVerify(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token: otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Invalid OTP");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
document.cookie = `token=${data.token}; path=/; max-age=86400`;
    function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("mfa_email");
  document.cookie = "token=; path=/; max-age=0";
  window.location.href = "/login";
}
    }

    localStorage.removeItem("mfa_email");
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Verify OTP
        </h1>

        <p className="mt-2 text-center text-slate-600">
          Enter the 6-digit code from your authenticator app
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-5">
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-green-600"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-2xl font-bold tracking-widest text-slate-900 placeholder-slate-400 outline-none focus:border-green-600"
            type="text"
            placeholder="000000"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700">
            Verify OTP
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center font-semibold text-red-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-slate-600">
          Back to{" "}
          <a href="/login" className="font-bold text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}