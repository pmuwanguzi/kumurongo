import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ClientDashboard() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.userType !== "CLIENT") redirect("/dashboard");

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
                  <Link href="/chat" className="btn btn-outline-primary btn-sm">
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
                    Track your service requests
                  </p>
                  <button className="btn btn-outline-primary btn-sm">
                    View Engagements
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Recent Activity</h5>
              <div className="text-center py-4 text-muted">
                <div style={{ fontSize: "3rem" }}>📭</div>
                <p className="mt-2">No activity yet</p>
                <Link href="/services" className="btn btn-primary btn-sm">
                  Find Your First Service
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}