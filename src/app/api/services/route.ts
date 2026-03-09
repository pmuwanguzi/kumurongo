import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET - Fetch all services (with optional search and category filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";

    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        ...(query && {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(category && {
          category: { contains: category, mode: "insensitive" },
        }),
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            isVerified: true,
            reviewsReceived: {
              select: { rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating for each service provider
    const servicesWithRating = services.map((service) => {
      const reviews = service.provider.reviewsReceived;
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
        ...service,
        provider: {
          ...service.provider,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        },
      };
    });

    return NextResponse.json(servicesWithRating);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST - Create a new service (Service Providers only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "SERVICE_PROVIDER") {
      return NextResponse.json(
        { error: "Only service providers can create services" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, category, price } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Title, description and category are required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        category,
        price: price ? parseFloat(price) : null,
        providerId: session.user.id,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
