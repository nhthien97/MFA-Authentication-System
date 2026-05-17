import { prisma } from "@/lib/db";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email } = body;

    // tìm user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // tạo secret
    const secret = speakeasy.generateSecret({
      name: `MFA-System (${email})`,
    });

    // lưu secret vào database
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        mfa_secret: secret.base32,
      },
    });

    // tạo QR code
    const qrCode = await QRCode.toDataURL(
      secret.otpauth_url
    );

    return Response.json({
      message: "MFA setup success",
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