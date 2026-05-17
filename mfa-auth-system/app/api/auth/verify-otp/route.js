import { prisma } from "@/lib/db";
import speakeasy from "speakeasy";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, token } = body;

    // tìm user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.mfa_secret) {
      return Response.json(
        { message: "MFA not setup" },
        { status: 400 }
      );
    }

    // verify OTP
    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: "base32",
      token,
    });

    if (!verified) {
      return Response.json(
        { message: "Invalid OTP" },
        { status: 401 }
      );
    }

    // bật MFA
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        mfa_enabled: true,
      },
    });

    return Response.json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}