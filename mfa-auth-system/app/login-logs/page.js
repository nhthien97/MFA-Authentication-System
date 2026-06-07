"use client";

import { useEffect, useState } from "react";

export default function LoginLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("/api/login-logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Login Logs</h1>
            <p className="mt-2 text-slate-500">
              Monitor authentication activities and security events.
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-3">Email</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>User Agent</th>
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

                    <td className="max-w-xs truncate text-slate-500">
                      {log.user_agent}
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
                    colSpan="5"
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
    </div>
  );
}
