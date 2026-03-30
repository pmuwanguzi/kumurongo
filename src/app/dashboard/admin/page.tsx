import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminActions from "@/components/AdminActions";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) redirect("/login");
  if (
    session.user.userType !== "ADMIN" &&
    session.user.userType !== "SUPER_ADMIN"
  ) {
    redirect("/dashboard");
  }

  // Fetch stats
  const totalUsers = await prisma.user.count();
  const pendingProviders = await prisma.user.count({
    where: { userType: "SERVICE_PROVIDER", isVerified: false },
  });
  const pendingFlags = await prisma.flag.count({
    where: { status: "PENDING" },
  });
  const activeServices = await prisma.service.count({
    where: { isActive: true },
  });

  // Fetch unverified providers
  const unverifiedProviders = await prisma.user.findMany({
    where: { userType: "SERVICE_PROVIDER", isVerified: false },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      isSuspended: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch flagged users
  const flags = await prisma.flag.findMany({
    where: { status: "PENDING" },
    include: {
      flaggedBy: { select: { name: true, email: true } },
      flaggedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          userType: true,
          isSuspended: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Admin Panel 🛡️</h2>
              <p className="text-muted mb-0">
                Manage users and platform activity
              </p>
            </div>
            <span className="badge bg-danger px-3 py-2">
              {session.user.userType === "SUPER_ADMIN"
                ? "Super Admin"
                : "Admin"}
            </span>
          </div>

          {/* Stats */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>👥</div>
                <h4 className="fw-bold mt-2 mb-0">{totalUsers}</h4>
                <small className="text-muted">Total Users</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>⏳</div>
                <h4 className="fw-bold mt-2 mb-0">{pendingProviders}</h4>
                <small className="text-muted">Pending Verification</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>🚩</div>
                <h4 className="fw-bold mt-2 mb-0">{pendingFlags}</h4>
                <small className="text-muted">Pending Flags</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>🔧</div>
                <h4 className="fw-bold mt-2 mb-0">{activeServices}</h4>
                <small className="text-muted">Active Services</small>
              </div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                ⏳ Pending Provider Verifications
                {pendingProviders > 0 && (
                  <span className="badge bg-warning text-dark ms-2">
                    {pendingProviders}
                  </span>
                )}
              </h5>
              {unverifiedProviders.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <p>No pending verifications ✅</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unverifiedProviders.map((user) => (
                        <tr key={user.id}>
                          <td className="fw-semibold">{user.name}</td>
                          <td>{user.email}</td>
                          <td className="text-muted small">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              Pending
                            </span>
                          </td>
                          <td>
                            <AdminActions
                              userId={user.id}
                              action="verify"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Flagged Users */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                🚩 Flagged Users
                {pendingFlags > 0 && (
                  <span className="badge bg-danger ms-2">
                    {pendingFlags}
                  </span>
                )}
              </h5>
              {flags.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <p>No pending flags ✅</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Flagged User</th>
                        <th>Flagged By</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flags.map((flag) => (
                        <tr key={flag.id}>
                          <td>
                            <div className="fw-semibold">
                              {flag.flaggedUser.name}
                            </div>
                            <small className="text-muted">
                              {flag.flaggedUser.email}
                            </small>
                          </td>
                          <td>
                            <div>{flag.flaggedBy.name}</div>
                            <small className="text-muted">
                              {flag.flaggedBy.email}
                            </small>
                          </td>
                          <td>{flag.reason}</td>
                          <td className="text-muted small">
                            {new Date(flag.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <AdminActions
                              userId={flag.flaggedUser.id}
                              isSuspended={flag.flaggedUser.isSuspended}
                              action="suspend"
                            />
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