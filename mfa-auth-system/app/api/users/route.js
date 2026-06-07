import { prisma } from "@/lib/db";

export async function GET() {
  try {
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
      { message: "Server error" },
      { status: 500 }
    );
  }
}
