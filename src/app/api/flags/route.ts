import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET - Fetch flags (Admin only)
export async function GET(request: NextRequest) {
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

    const flags = await prisma.flag.findMany({
      include: {
        flaggedBy: { select: { id: true, name: true, email: true } },
        flaggedUser: { select: { id: true, name: true, email: true, userType: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(flags);
  } catch (error) {
    console.error("Error fetching flags:", error);
    return NextResponse.json(
      { error: "Failed to fetch flags" },
      { status: 500 }
    );
  }
}

// POST - Submit a flag
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { flaggedUserId, reason, proof } = body;

    if (!flaggedUserId || !reason) {
      return NextResponse.json(
        { error: "Flagged user and reason are required" },
        { status: 400 }
      );
    }

    if (flaggedUserId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot flag yourself" },
        { status: 400 }
      );
    }

    // Check if already flagged
    const existing = await prisma.flag.findFirst({
      where: {
        flaggedById: session.user.id,
        flaggedUserId,
        status: "PENDING",
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already flagged this user" },
        { status: 409 }
      );
    }

    const flag = await prisma.flag.create({
      data: {
        flaggedById: session.user.id,
        flaggedUserId,
        reason,
        proof,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        action: "USER_FLAGGED",
        userId: session.user.id,
        targetId: flaggedUserId,
      },
    });

    return NextResponse.json(flag, { status: 201 });
  } catch (error) {
    console.error("Error creating flag:", error);
    return NextResponse.json(
      { error: "Failed to submit flag" },
      { status: 500 }
    );
  }
}