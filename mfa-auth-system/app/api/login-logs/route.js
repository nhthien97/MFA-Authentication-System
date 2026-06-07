import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const logs = await prisma.loginLog.findMany({
      orderBy: {
        login_time: "desc",
      },
      take: 10,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return Response.json({
      message: "Get login logs success",
      logs,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
