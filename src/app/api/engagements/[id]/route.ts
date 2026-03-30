import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// PUT - Accept or reject an engagement (Providers only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["ACCEPTED", "REJECTED", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Find the engagement
    const engagement = await prisma.engagement.findUnique({
      where: { id },
    });

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement not found" },
        { status: 404 }
      );
    }

    // Only the provider can accept/reject
    if (engagement.providerId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to update this engagement" },
        { status: 403 }
      );
    }

    const updated = await prisma.engagement.update({
      where: { id },
      data: { status },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        action: `ENGAGEMENT_${status}`,
        userId: session.user.id,
        targetId: id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating engagement:", error);
    return NextResponse.json(
      { error: "Failed to update engagement" },
      { status: 500 }
    );
  }
}