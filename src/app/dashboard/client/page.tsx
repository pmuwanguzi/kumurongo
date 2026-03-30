import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function ClientDashboard() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.userType !== "CLIENT") redirect("/dashboard");

  // Fetch client's engagements
  const engagements = await prisma.engagement.findMany({
    where: { clientId: session.user.id },
    include: {
      service: { select: { title: true, category: true } },
      provider: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const statusColor: Record<string, string> = {
    PENDING: "warning",
    ACCEPTED: "success",
    REJECTED: "danger",
    COMPLETED: "secondary",
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">

          {/* Welcome Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">
                Welcome back, {session.user.name} 
              </h2>
              <p className="text-muted mb-0">
                Find and connect with service providers
              </p>
            </div>
            <span className="badge bg-primary px-3 py-2">Client</span>
          </div>

          {/* Quick Actions */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>🔍</div>
                  <h5 className="fw-bold mt-3">Find a Service</h5>
                  <p className="text-muted small">
                    Search and browse available services
                  </p>
                  <Link href="/services" className="btn btn-primary btn-sm">
                    Browse Services
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>💬</div>
                  <h5 className="fw-bold mt-3">My Messages</h5>
                  <p className="text-muted small">
                    Chat with service providers
                  </p>
                  <Link
                    href="/chat"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Open Messages
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>📋</div>
                  <h5 className="fw-bold mt-3">My Engagements</h5>
                  <p className="text-muted small">
                    {engagements.length} total engagement
                    {engagements.length !== 1 ? "s" : ""}
                  </p>
                  <span className="btn btn-outline-primary btn-sm disabled">
                    View Below
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Engagements Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">My Engagements</h5>
              {engagements.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <div style={{ fontSize: "3rem" }}>📭</div>
                  <p className="mt-2">No engagements yet</p>
                  <Link href="/services" className="btn btn-primary btn-sm">
                    Find Your First Service
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Service</th>
                        <th>Provider</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {engagements.map((eng) => (
                        <tr key={eng.id}>
                          <td className="fw-semibold">
                            {eng.service.title}
                          </td>
                          <td>{eng.provider.name}</td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {eng.service.category}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${statusColor[eng.status]}`}
                            >
                              {eng.status}
                            </span>
                          </td>
                          <td className="text-muted small">
                            {new Date(eng.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}