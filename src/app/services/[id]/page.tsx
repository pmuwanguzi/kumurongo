import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          isVerified: true,
          createdAt: true,
          reviewsReceived: {
            include: {
              reviewer: {
                select: { name: true },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          servicesProvided: {
            where: { isActive: true },
            select: { id: true, title: true, category: true, price: true },
          },
        },
      },
    },
  });

  if (!service) notFound();

  const reviews = service.provider.reviewsReceived;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-warning" : "text-muted"}>
        ★
      </span>
    ));
  };

  return (
    <div className="container py-5">
      <div className="row g-4">

        {/* Left Column — Service Details */}
        <div className="col-lg-8">

          {/* Back Button */}
          <Link
            href="/services"
            className="btn btn-outline-secondary btn-sm mb-4"
          >
            ← Back to Services
          </Link>

          {/* Service Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <span className="badge bg-light text-primary border border-primary-subtle mb-3">
                {service.category}
              </span>
              <h2 className="fw-bold mb-3">{service.title}</h2>
              <p className="text-muted">{service.description}</p>

              <hr />

              {/* Price */}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small">Price</span>
                  <div className="fw-bold fs-5 text-success">
                    {service.price
                      ? `RWF ${service.price.toLocaleString()}`
                      : "Negotiable"}
                  </div>
                </div>
                {session ? (
                  session.user.userType === "CLIENT" ? (
                    <Link
                      href={`/chat?providerId=${service.provider.id}&serviceId=${service.id}`}
                      className="btn btn-primary px-4"
                    >
                      💬 Chat with Provider
                    </Link>
                  ) : (
                    <span className="text-muted small">
                      Log in as a client to request this service
                    </span>
                  )
                ) : (
                  <Link href="/login" className="btn btn-primary px-4">
                    Login to Request
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                Reviews ({reviews.length})
              </h5>
              {reviews.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <p>No reviews yet</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="mb-4 pb-4 border-bottom">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">
                        {review.reviewer.name}
                      </span>
                      <span className="small text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-2">{renderStars(review.rating)}</div>
                    <p className="text-muted small mb-0">{review.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column — Provider Profile */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: "1rem" }}>
            <div className="card-body p-4">

              {/* Provider Avatar */}
              <div className="text-center mb-4">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 72, height: 72, fontSize: "1.8rem" }}
                >
                  {service.provider.name?.charAt(0).toUpperCase()}
                </div>
                <h5 className="fw-bold mb-1">
                  {service.provider.name}
                  {service.provider.isVerified && (
                    <span className="text-success ms-2 small">✓ Verified</span>
                  )}
                </h5>
                <div className="mb-1">
                  {renderStars(avgRating)}
                  <span className="text-muted small ms-1">
                    {avgRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
                <small className="text-muted">
                  Member since{" "}
                  {new Date(service.provider.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )}
                </small>
              </div>

              <hr />

              {/* Other Services */}
              {service.provider.servicesProvided.length > 1 && (
                <>
                  <h6 className="fw-bold mb-3">Other Services</h6>
                  {service.provider.servicesProvided
                    .filter((s) => s.id !== service.id)
                    .map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}`}
                        className="text-decoration-none"
                      >
                        <div className="p-2 rounded bg-light mb-2">
                          <div className="small fw-semibold text-dark">
                            {s.title}
                          </div>
                          <div className="small text-muted">{s.category}</div>
                        </div>
                      </Link>
                    ))}
                  <hr />
                </>
              )}

              {/* Contact Button */}
              {session ? (
                session.user.userType === "CLIENT" && (
                  <Link
                    href={`/chat?providerId=${service.provider.id}&serviceId=${service.id}`}
                    className="btn btn-primary w-100"
                  >
                    💬 Chat with Provider
                  </Link>
                )
              ) : (
                <Link href="/login" className="btn btn-primary w-100">
                  Login to Contact
                </Link>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}