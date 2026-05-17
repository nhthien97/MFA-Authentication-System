import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, password } = body;

    // kiểm tra thiếu dữ liệu
    if (!email || !password) {
      return Response.json(
        { message: "Missing email or password" },
        { status: 400 }
      );
    }

    // kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return Response.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
      },
    });

    return Response.json({
      message: "Register success",
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