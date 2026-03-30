import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// POST - Submit a review
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { engagementId, content, rating } = body;

    if (!engagementId || !content || !rating) {
      return NextResponse.json(
        { error: "Engagement, content and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Find the engagement
    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
    });

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement not found" },
        { status: 404 }
      );
    }

    if (engagement.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Can only review completed engagements" },
        { status: 400 }
      );
    }

    // Check if user is part of this engagement
    const isClient = engagement.clientId === session.user.id;
    const isProvider = engagement.providerId === session.user.id;

    if (!isClient && !isProvider) {
      return NextResponse.json(
        { error: "You are not part of this engagement" },
        { status: 403 }
      );
    }

    // Check if already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        engagementId,
        reviewerId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this engagement" },
        { status: 409 }
      );
    }

    // Reviewee is the other party
    const revieweeId = isClient
      ? engagement.providerId
      : engagement.clientId;

    const review = await prisma.review.create({
      data: {
        content,
        rating,
        reviewerId: session.user.id,
        revieweeId,
        engagementId,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        action: "REVIEW_SUBMITTED",
        userId: session.user.id,
        targetId: review.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}