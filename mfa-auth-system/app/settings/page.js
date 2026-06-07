"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);

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
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
      });

  }, []);


  function logout(){

    localStorage.clear();

    window.location.href="/login";

  }


  return (

    <div className="
    min-h-screen
    bg-slate-950
    p-8
    text-white
    ">


      <div className="
      mx-auto
      max-w-4xl
      bg-white
      text-slate-900
      rounded-3xl
      p-8
      shadow-2xl
      ">


        <div className="
        flex
        justify-between
        items-center
        mb-8
        ">


          <div>

            <h1 className="
            text-3xl
            font-bold
            ">
              Settings
            </h1>


            <p className="
            text-slate-500
            mt-2
            ">
              Manage your MFA account
            </p>


          </div>



          <a

          href="/dashboard"

          className="
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
          font-bold
          "

          >

          Dashboard

          </a>


        </div>




        <div className="
        space-y-5
        ">


          <Box
            title="Account Email"
            value={user?.email || "Loading"}
          />

          <Box
            title="MFA Protection"
            value={
              user?.mfa_enabled
              ?
              "Enabled 🟢"
              :
              "Disabled 🔴"
            }
          />


          <Box
            title="Failed Login Attempts"
            value={
              user?.failed_attempts ?? 0
            }
          />



        </div>



        <button

        onClick={logout}

        className="
        mt-10
        w-full
        bg-red-600
        text-white
        py-3
        rounded-xl
        font-bold
        hover:bg-red-700
        "

        >

        Logout Account

        </button>



      </div>


    </div>

  );

}



function Box({
title,
value
}){


return (

<div className="
border
bg-slate-50
rounded-2xl
p-6
">

<p className="
text-slate-500
font-semibold
">
{title}
</p>


<h2 className="
text-2xl
font-bold
mt-2
">
{value}
</h2>


</div>

)

}
