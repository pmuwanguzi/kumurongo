import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.userType !== "SUPER_ADMIN") redirect("/dashboard");

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">

          {/* Welcome Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Super Admin Panel </h2>
              <p className="text-muted mb-0">
                Full platform control and oversight
              </p>
            </div>
            <span className="badge bg-purple px-3 py-2"
              style={{ backgroundColor: "#6f42c1" }}>
              Super Admin
            </span>
          </div>

          {/* Quick Actions */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>👤</div>
                  <h5 className="fw-bold mt-3">Create Admin</h5>
                  <p className="text-muted small">
                    Add a new administrator account
                  </p>
                  <button className="btn btn-danger btn-sm">
                    Create Admin
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>📊</div>
                  <h5 className="fw-bold mt-3">Audit Logs</h5>
                  <p className="text-muted small">
                    View and export all system activity
                  </p>
                  <button className="btn btn-outline-danger btn-sm">
                    View Logs
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>🗑️</div>
                  <h5 className="fw-bold mt-3">Manage Users</h5>
                  <p className="text-muted small">
                    View, suspend or delete any account
                  </p>
                  <button className="btn btn-outline-danger btn-sm">
                    Manage Users
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Panel Link */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Admin Panel Access</h5>
              <p className="text-muted small mb-3">
                You also have full access to the regular admin panel
              </p>
              <Link
                href="/dashboard/admin"
                className="btn btn-outline-secondary btn-sm"
              >
                Go to Admin Panel →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}