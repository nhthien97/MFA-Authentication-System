import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return Response.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    const token = auth.replace("Bearer ", "");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const currentUser = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return Response.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        email: true,
        role: true,
        mfa_enabled: true,
        failed_attempts: true,
        locked_until: true,
        created_at: true,
      },
    });

    return Response.json({
      message: "Get users success",
      users,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}