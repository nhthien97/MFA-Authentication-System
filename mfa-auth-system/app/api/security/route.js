import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";


export async function GET(req){

try{

const auth =
req.headers.get("authorization");


if(!auth){

return Response.json(
{
message:"No token"
},
{
status:401
}
);

}


const token =
auth.replace(
"Bearer ",
""
);



const decoded =
jwt.verify(
token,
process.env.JWT_SECRET
);



const user =
await prisma.user.findUnique({

where:{
id:decoded.userId
},

select:{

email:true,

mfa_enabled:true,

failed_attempts:true,

locked_until:true

}

});



return Response.json({

user

});


}catch(error){


return Response.json(
{
message:"Unauthorized"
},
{
status:401
}
);


}


}
