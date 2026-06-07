"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

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
        setUser(data.user);
      });
  }, []);

  async function changePassword(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    setMessage(data.message);

    if (res.ok) {
      setOldPassword("");
      setNewPassword("");
    }
  }


  async function disableMFA() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/auth/disable-mfa", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      window.location.reload();
    }
  }

  function logout() {
    localStorage.clear();
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="mt-2 text-slate-500">
              Manage your MFA account
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            Dashboard
          </a>
        </div>

        <div className="space-y-5">
          <Box title="Account Email" value={user?.email || "Loading"} />

          <Box
            title="MFA Protection"
            value={user?.mfa_enabled ? "Enabled 🟢" : "Disabled 🔴"}
          />

          <Box
            title="Failed Login Attempts"
            value={user?.failed_attempts ?? 0}
          />
        </div>

        <form
          onSubmit={changePassword}
          className="mt-8 rounded-2xl border bg-slate-50 p-6"
        >
          <h2 className="mb-5 text-2xl font-bold">Change Password</h2>

          <input
            className="mb-4 w-full rounded-xl border px-4 py-3 text-slate-900"
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <input
            className="mb-4 w-full rounded-xl border px-4 py-3 text-slate-900"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700">
            Change Password
          </button>

          {message && (
            <p className="mt-4 text-center font-semibold text-blue-600">
              {message}
            </p>
          )}
        </form>


        <button
          onClick={disableMFA}
          className="mt-8 w-full rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
        >
          Disable / Reset MFA
        </button>

        <button
          onClick={logout}
          className="mt-8 w-full rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700"
        >
          Logout Account
        </button>
      </div>
    </div>
  );
}

function Box({ title, value }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-6">
      <p className="font-semibold text-slate-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold">{value}</h2>
    </div>
  );
}