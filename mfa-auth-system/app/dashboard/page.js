"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [token, setToken] = useState("");
  const [logs, setLogs] = useState([]);
  const [security, setSecurity] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("token");

    if (!saved) {
      window.location.href = "/login";
      return;
    }

    setToken(saved);

    fetch("/api/login-logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
      });

    fetch("/api/security", {
      headers: {
        Authorization: `Bearer ${saved}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSecurity(data.user || null);
      });
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("mfa_email");
    window.location.href = "/login";
  }

  const isLocked =
    security?.locked_until &&
    new Date(security.locked_until) > new Date();

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <aside className="w-full bg-slate-900 p-6 lg:min-h-screen lg:w-72 lg:p-8">
        <h1 className="mb-8 text-3xl font-bold lg:mb-12">
          🔐 MFA
        </h1>

        <nav className="grid gap-3 sm:grid-cols-4 lg:block lg:space-y-4">
          <div className="rounded-xl bg-blue-600 p-4 font-bold">
            Dashboard
          </div>

          <a
  href="/security"
  className="block rounded-xl p-4 text-slate-300 hover:bg-slate-800"
>
  Security
</a>

          <a
  href="/login-logs"
  className="block rounded-xl p-4 text-slate-300 hover:bg-slate-800"
>
  Login Logs
</a>

          <a
 href="/admin/users"
 className="block rounded-xl p-4 text-slate-300 hover:bg-slate-800"
>
 Admin Users
</a>

          <a
 href="/settings"
 className="block rounded-xl p-4 text-slate-300 hover:bg-slate-800"
>
 Settings
</a>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-4xl font-bold">
              Security Dashboard
            </h2>

            <p className="mt-2 text-slate-400">
              Multi Factor Authentication Control Center
            </p>
          </div>

          <button
            onClick={logout}
            className="w-fit rounded-xl bg-red-600 px-6 py-3 font-bold hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card
            title="Authentication"
            value="Protected"
            color="text-green-500"
          />

          <Card
            title="MFA Status"
            value={security?.mfa_enabled ? "Enabled" : "Disabled"}
            color={security?.mfa_enabled ? "text-blue-500" : "text-red-500"}
          />

          <Card
            title="Session"
            value={token ? "JWT Active" : "No Token"}
            color={token ? "text-purple-500" : "text-red-500"}
          />

          <Card
            title="Account Status"
            value={isLocked ? "Locked" : "Active"}
            color={isLocked ? "text-red-500" : "text-green-500"}
          />
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 text-slate-900 shadow-xl">
            <h3 className="mb-6 text-2xl font-bold">
              Security Overview
            </h3>

            <ul className="space-y-5">
              <li>✅ Password encrypted with bcrypt</li>
              <li>✅ OTP protected authentication</li>
              <li>✅ JWT session management</li>
              <li>✅ Account protection enabled</li>
              <li>✅ Failed Attempts: {security?.failed_attempts ?? 0}</li>
              <li>
                ✅ Account Status:{" "}
                <span className={isLocked ? "font-bold text-red-600" : "font-bold text-green-600"}>
                  {isLocked ? "Locked" : "Active"}
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 text-slate-900 shadow-xl">
            <h3 className="mb-6 text-2xl font-bold">
              MFA Actions
            </h3>

            <a
              href="/setup-mfa"
              className="mb-4 block rounded-xl bg-blue-600 py-3 text-center font-bold text-white hover:bg-blue-700"
            >
              Setup MFA
            </a>

            <a
              href="/verify-otp"
              className="block rounded-xl bg-green-600 py-3 text-center font-bold text-white hover:bg-green-700"
            >
              Verify OTP
            </a>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-8 text-slate-900 shadow-xl">
          <h3 className="mb-6 text-2xl font-bold">
            Recent Login Activity
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-3">Email</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => {
                  const isSuccess =
                    log.status.includes("SUCCESS") ||
                    log.status.includes("REQUIRED");

                  return (
                    <tr key={log.id} className="border-b">
                      <td className="py-4">
                        {log.user?.email || "Unknown"}
                      </td>

                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold ${
                            isSuccess
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td className="text-slate-500">
                        {log.ip_address}
                      </td>

                      <td className="text-slate-500">
                        {new Date(log.login_time).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-6 text-center text-slate-500"
                    >
                      No login logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-slate-900 shadow-xl">
      <p className="mb-3 text-slate-500">{title}</p>

      <h2 className={`text-3xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}
