import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET - Fetch engagements for the logged in user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "client";

    const engagements = await prisma.engagement.findMany({
      where:
        role === "client"
          ? { clientId: session.user.id }
          : { providerId: session.user.id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        provider: { select: { id: true, name: true, email: true } },
        service: { select: { id: true, title: true, category: true } },
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(engagements);
  } catch (error) {
    console.error("Error fetching engagements:", error);
    return NextResponse.json(
      { error: "Failed to fetch engagements" },
      { status: 500 }
    );
  }
}

// POST - Create a new engagement request (Clients only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can request engagements" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { serviceId, providerId, notes } = body;

    if (!serviceId || !providerId) {
      return NextResponse.json(
        { error: "Service and provider are required" },
        { status: 400 }
      );
    }

    // Check if engagement already exists
    const existing = await prisma.engagement.findFirst({
      where: {
        clientId: session.user.id,
        serviceId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already have an active engagement for this service" },
        { status: 409 }
      );
    }

    const engagement = await prisma.engagement.create({
      data: {
        clientId: session.user.id,
        providerId,
        serviceId,
        notes,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        action: "ENGAGEMENT_REQUESTED",
        userId: session.user.id,
        targetId: engagement.id,
      },
    });

    return NextResponse.json(engagement, { status: 201 });
  } catch (error) {
    console.error("Error creating engagement:", error);
    return NextResponse.json(
      { error: "Failed to create engagement" },
      { status: 500 }
    );
  }
}