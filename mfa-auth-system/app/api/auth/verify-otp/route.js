import { prisma } from "@/lib/db";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";


export async function POST(req) {

  try {

    const { email, token } =
      await req.json();


    const ip =
      req.headers.get("x-forwarded-for")
      ||
      "unknown";


    const userAgent =
      req.headers.get("user-agent")
      ||
      "unknown";



    if (!email || !token) {

      return Response.json(
        {
          message:
          "Missing email or OTP"
        },
        {
          status:400
        }
      );

    }



    const user =
      await prisma.user.findUnique({
        where:{
          email
        }
      });



    if (
      !user ||
      !user.mfa_secret
    ) {

      return Response.json(
        {
          message:
          "MFA not setup"
        },
        {
          status:400
        }
      );

    }




    const verified =
    speakeasy.totp.verify({

      secret:
      user.mfa_secret,

      encoding:
      "base32",

      token:
      token.trim(),

      window:2

    });




    // OTP sai

    if (!verified) {


      await prisma.loginLog.create({

        data:{

          user_id:
          user.id,

          ip_address:
          ip,

          user_agent:
          userAgent,

          status:
          "FAILED_OTP"

        }

      });



      return Response.json(
        {
          message:
          "Invalid OTP"
        },
        {
          status:401
        }
      );


    }




    // OTP đúng


    await prisma.user.update({

      where:{
        email
      },


      data:{

        mfa_enabled:true,

        failed_attempts:0,

        locked_until:null

      }

    });




    await prisma.loginLog.create({

      data:{

        user_id:
        user.id,

        ip_address:
        ip,

        user_agent:
        userAgent,

        status:
        "OTP_SUCCESS"

      }

    });





    const jwtToken =
    jwt.sign(

      {

        userId:user.id,

        email:user.email

      },


      process.env.JWT_SECRET,


      {

        expiresIn:"1d"

      }

    );





    return Response.json({

      message:
      "OTP verified successfully",

      token:
      jwtToken,


      user:{

        id:user.id,

        email:user.email,

        mfa_enabled:true

      }


    });




  } catch(error){


    console.log(error);


    return Response.json(
      {
        message:
        "Server error"
      },
      {
        status:500
      }
    );

  }


}