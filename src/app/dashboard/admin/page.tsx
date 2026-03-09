import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) redirect("/login");
  if (
    session.user.userType !== "ADMIN" &&
    session.user.userType !== "SUPER_ADMIN"
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">

          {/* Welcome Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">
                Admin Panel 
              </h2>
              <p className="text-muted mb-0">
                Manage users and platform activity
              </p>
            </div>
            <span className="badge bg-danger px-3 py-2">
              {session.user.userType === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </span>
          </div>

          {/* Stats Row */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>👥</div>
                <h4 className="fw-bold mt-2 mb-0">0</h4>
                <small className="text-muted">Total Users</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>⏳</div>
                <h4 className="fw-bold mt-2 mb-0">0</h4>
                <small className="text-muted">Pending Verification</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>🚩</div>
                <h4 className="fw-bold mt-2 mb-0">0</h4>
                <small className="text-muted">Pending Flags</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: "2rem" }}>🔧</div>
                <h4 className="fw-bold mt-2 mb-0">0</h4>
                <small className="text-muted">Active Services</small>
              </div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                ⏳ Pending Provider Verifications
              </h5>
              <div className="text-center py-4 text-muted">
                <p>No pending verifications</p>
              </div>
            </div>
          </div>

          {/* Flagged Users */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">🚩 Flagged Users</h5>
              <div className="text-center py-4 text-muted">
                <p>No flagged users</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}