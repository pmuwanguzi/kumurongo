import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import EngagementActions from "@/components/EngagementActions";

export default async function ProviderDashboard() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.userType !== "SERVICE_PROVIDER") redirect("/dashboard");

  // Fetch provider's services
  const services = await prisma.service.findMany({
    where: { providerId: session.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch incoming engagement requests
  const engagements = await prisma.engagement.findMany({
    where: { providerId: session.user.id },
    include: {
      client: { select: { name: true, email: true } },
      service: { select: { title: true, category: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const pendingCount = engagements.filter(
    (e) => e.status === "PENDING"
  ).length;

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
                Manage your services and client engagements
              </p>
            </div>
            <span className="badge bg-success px-3 py-2">
              Service Provider
            </span>
          </div>

          {/* Stats Row */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>🛠️</div>
                <h4 className="fw-bold mt-2 mb-0">{services.length}</h4>
                <small className="text-muted">Active Services</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>📩</div>
                <h4 className="fw-bold mt-2 mb-0">{pendingCount}</h4>
                <small className="text-muted">Pending Requests</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>✅</div>
                <h4 className="fw-bold mt-2 mb-0">
                  {engagements.filter((e) => e.status === "COMPLETED").length}
                </h4>
                <small className="text-muted">Completed Jobs</small>
              </div>
            </div>
          </div>

          {/* My Services */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">My Services</h5>
                <Link
                  href="/dashboard/provider/services/new"
                  className="btn btn-success btn-sm"
                >
                  + Add Service
                </Link>
              </div>
              {services.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p>No services listed yet</p>
                  <Link
                    href="/dashboard/provider/services/new"
                    className="btn btn-success btn-sm"
                  >
                    List Your First Service
                  </Link>
                </div>
              ) : (
                <div className="row g-3">
                  {services.map((service) => (
                    <div key={service.id} className="col-md-6">
                      <div className="p-3 border rounded bg-light">
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="fw-semibold">{service.title}</div>
                            <small className="text-muted">
                              {service.category}
                            </small>
                          </div>
                          <div className="text-success fw-bold small">
                            {service.price
                              ? `RWF ${service.price.toLocaleString()}`
                              : "Negotiable"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Engagement Requests */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                Engagement Requests
                {pendingCount > 0 && (
                  <span className="badge bg-warning text-dark ms-2">
                    {pendingCount} pending
                  </span>
                )}
              </h5>
              {engagements.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p>No engagement requests yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {engagements.map((eng) => (
                        <tr key={eng.id}>
                          <td>
                            <div className="fw-semibold">
                              {eng.client.name}
                            </div>
                            <small className="text-muted">
                              {eng.client.email}
                            </small>
                          </td>
                          <td>{eng.service.title}</td>
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
                          <td>
                            {eng.status === "PENDING" && (
                              <EngagementActions engagementId={eng.id} />
                            )}
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