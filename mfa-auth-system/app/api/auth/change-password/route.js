import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    let token = null;

    const auth = req.headers.get("authorization");
    if (auth) {
      token = auth.replace("Bearer ", "");
    }

    if (!token) {
      token = req.cookies.get("token")?.value;
    }

    if (!token) {
      return Response.json({ message: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { oldPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!valid) {
      return Response.json(
        { message: "Old password is incorrect" },
        { status: 401 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: newHash,
        failed_attempts: 0,
        locked_until: null,
      },
    });

    return Response.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}