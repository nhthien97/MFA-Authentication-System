"use client";

import { useState } from "react";

export default function SetupMFAPage() {
  const [email, setEmail] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");

  async function handleSetupMFA(e) {
    e.preventDefault();

    const res = await fetch("/api/auth/setup-mfa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    setMessage(data.message);

    if (data.qrCode) {
      setQrCode(data.qrCode);
      setSecret(data.secret);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Setup MFA
        </h1>

        <form onSubmit={handleSetupMFA}>
          <input
            className="w-full border p-3 rounded mb-4"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white p-3 rounded">
            Generate QR Code
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm">
            {message}
          </p>
        )}

        {qrCode && (
          <div className="mt-6 text-center">
            <img
              src={qrCode}
              alt="QR Code"
              className="mx-auto"
            />

            <p className="mt-4 text-sm break-all">
              Secret Key:
              <br />
              {secret}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}