"use client";

import { useEffect, useState } from "react";

export default function VerifyOTPPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        token,
      }),
    });

    const data = await res.json();

    setMessage(data.message);

    // Nếu verify thành công
    if (res.ok) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Verify OTP
        </h1>

        <input
          className="w-full border p-3 rounded mb-4 bg-gray-100"
          type="email"
          value={email}
          readOnly
        />

        <input
          className="w-full border p-3 rounded mb-4"
          type="text"
          placeholder="Enter OTP"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <button className="w-full bg-green-600 text-white p-3 rounded">
          Verify OTP
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}