"use client";

import { useEffect, useState } from "react";

export default function UsersPage(){

const [users,setUsers]=useState([]);


useEffect(()=>{

const token = localStorage.getItem("token");

fetch("/api/users", {
headers:{
Authorization:`Bearer ${token}`
}
})
.then(res=>res.json())
.then(data=>{

if(data.message === "Access denied"){
 window.location.href="/dashboard";
 return;
}

setUsers(data.users || []);

});

},[]);



return (

<div className="
min-h-screen
bg-slate-950
p-10
text-white
">


<div className="
bg-white
text-slate-900
rounded-3xl
p-8
shadow-xl
">


<div className="
flex
justify-between
mb-8
">

<div>

<h1 className="
text-3xl
font-bold
">
User Management
</h1>


<p className="
text-slate-500
">
Manage MFA system users
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


<table className="
w-full
">

<thead>

<tr className="
border-b
text-left
text-slate-500
">

<th className="py-3">
Email
</th>

<th>
Role
</th>


<th>
MFA
</th>


<th>
Failed
</th>


<th>
Status
</th>


</tr>

</thead>


<tbody>


{users.map(user=>(

<tr
key={user.id}
className="
border-b
"
>

<td className="py-4">
{user.email}
</td>


<td>

<span className="
px-3
py-1
rounded-full
bg-blue-100
text-blue-700
font-bold
">

{user.role}

</span>

</td>



<td>

{
user.mfa_enabled
?
"🟢 Enabled"
:
"🔴 Disabled"
}

</td>



<td>

{user.failed_attempts}

</td>


<td>

{
user.locked_until
?
"🔴 Locked"
:
"🟢 Active"
}

</td>


</tr>


))}


</tbody>


</table>


</div>


</div>


);

}
