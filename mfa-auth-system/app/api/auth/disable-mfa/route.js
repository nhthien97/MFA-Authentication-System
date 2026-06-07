import { prisma } from "@/lib/db";
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
      return Response.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        mfa_secret: null,
        mfa_enabled: false,
      },
    });

    return Response.json({
      message: "MFA disabled successfully",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
