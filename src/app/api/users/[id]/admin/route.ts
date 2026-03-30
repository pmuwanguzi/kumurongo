import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      session.user.userType !== "ADMIN" &&
      session.user.userType !== "SUPER_ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (!["verify", "suspend", "unsuspend"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    let updateData = {};

    if (action === "verify") {
      updateData = { isVerified: true };
    } else if (action === "suspend") {
      updateData = { isSuspended: true };
    } else if (action === "unsuspend") {
      updateData = { isSuspended: false };
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        action: `ADMIN_${action.toUpperCase()}`,
        userId: session.user.id,
        targetId: id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error performing admin action:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    );
  }
}