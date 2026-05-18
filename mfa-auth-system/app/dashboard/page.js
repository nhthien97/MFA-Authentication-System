"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      window.location.href = "/login";
      return;
    }

    setToken(savedToken);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("mfa_email");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4">
          MFA Dashboard
        </h1>

        <p className="text-gray-600 mb-6">
          Bạn đã đăng nhập thành công vào hệ thống bảo mật MFA.
        </p>

        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">JWT Token</h2>
          <p className="text-xs break-all text-gray-600">
            {token}
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="/setup-mfa"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Setup MFA
          </a>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}