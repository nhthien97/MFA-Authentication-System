import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Missing email or password" },
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

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return Response.json(
        { message: "Wrong password" },
        { status: 401 }
      );
    }

    if (user.mfa_enabled) {
      return Response.json({
        message: "MFA required",
        requireOTP: true,
        email: user.email,
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      "SECRET_KEY",
      {
        expiresIn: "1d",
      }
    );

    return Response.json({
      message: "Login success",
      token,
      user: {
        id: user.id,
        email: user.email,
        mfa_enabled: user.mfa_enabled,
      },
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}