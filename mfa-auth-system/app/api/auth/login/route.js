import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, password } = body;

    // kiểm tra user
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

    // kiểm tra password
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

    // tạo JWT token
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
      user,
    });

  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}