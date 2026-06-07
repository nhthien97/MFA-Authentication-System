"use client";

import { useEffect, useState } from "react";

export default function SecurityPage() {
  const [security, setSecurity] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("/api/security", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSecurity(data.user);
      });
  }, []);

  const isLocked =
    security?.locked_until &&
    new Date(security.locked_until) > new Date();

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Security Settings</h1>
            <p className="mt-2 text-slate-500">
              View account protection and MFA security status.
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SecurityCard
            title="Email"
            value={security?.email || "Loading..."}
            color="text-slate-900"
          />

          <SecurityCard
            title="MFA Status"
            value={security?.mfa_enabled ? "Enabled" : "Disabled"}
            color={security?.mfa_enabled ? "text-green-600" : "text-red-600"}
          />

          <SecurityCard
            title="Failed Attempts"
            value={security?.failed_attempts ?? 0}
            color={
              security?.failed_attempts > 0
                ? "text-red-600"
                : "text-green-600"
            }
          />

          <SecurityCard
            title="Account Status"
            value={isLocked ? "Locked" : "Active"}
            color={isLocked ? "text-red-600" : "text-green-600"}
          />
        </div>

        <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
          <h2 className="mb-4 text-xl font-bold">Security Checklist</h2>

          <ul className="space-y-3 text-slate-700">
            <li>✅ Password is hashed using bcrypt</li>
            <li>✅ JWT is used after successful authentication</li>
            <li>✅ MFA uses TOTP with Google Authenticator</li>
            <li>✅ Failed login attempts are tracked</li>
            <li>✅ Account lock protection is enabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SecurityCard({ title, value, color }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-6">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <h2 className={`mt-3 text-2xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}
