import { prisma } from "@/lib/db";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { message: "Missing email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.mfa_enabled && user.mfa_secret) {
      return Response.json(
        {
          message: "MFA is already enabled for this account. Please use Verify OTP.",
        },
        { status: 400 }
      );
    }

    const secret = speakeasy.generateSecret({
      name: `MFA-System (${email})`,
    });

    await prisma.user.update({
      where: { email },
      data: {
        mfa_secret: secret.base32,
        mfa_enabled: false,
      },
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return Response.json({
      message: "QR Code generated successfully",
      qrCode,
      secret: secret.base32,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}