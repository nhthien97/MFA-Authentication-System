"use client";

import { useState } from "react";

export default function SetupMFAPage() {
  const [email, setEmail] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");

  async function handleSetupMFA(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/setup-mfa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok && data.qrCode) {
      setQrCode(data.qrCode);
      setSecret(data.secret);
      localStorage.setItem("mfa_email", email);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Setup MFA
        </h1>

        <p className="mt-2 text-center text-slate-600">
          Generate QR Code for Google Authenticator
        </p>

        <form onSubmit={handleSetupMFA} className="mt-8 space-y-5">
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-blue-600"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">
            Generate QR Code
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center font-semibold text-blue-600">
            {message}
          </p>
        )}

        {qrCode && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Scan this QR Code
            </h2>

            <img
              src={qrCode}
              alt="QR Code"
              className="mx-auto h-52 w-52 rounded-xl bg-white p-3 shadow"
            />

            <p className="mt-5 font-bold text-slate-900">Secret Key</p>

            <p className="mt-2 break-all rounded-xl border bg-white p-3 text-sm font-mono text-slate-700">
              {secret}
            </p>

            <a
              href="/verify-otp"
              className="mt-5 block rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700"
            >
              Continue to Verify OTP
            </a>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/dashboard" className="font-bold text-blue-600">
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}