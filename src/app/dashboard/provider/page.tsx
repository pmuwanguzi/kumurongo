import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProviderDashboard() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.userType !== "SERVICE_PROVIDER") redirect("/dashboard");

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

          {/* Quick Actions */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>➕</div>
                  <h5 className="fw-bold mt-3">Add a Service</h5>
                  <p className="text-muted small">
                    List a new service you offer
                  </p>
                  <Link
                    href="/dashboard/provider/services/new"
                    className="btn btn-success btn-sm"
                  >
                    Create Service
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>📩</div>
                  <h5 className="fw-bold mt-3">Engagement Requests</h5>
                  <p className="text-muted small">
                    View and respond to client requests
                  </p>
                  <button className="btn btn-outline-success btn-sm">
                    View Requests
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>💬</div>
                  <h5 className="fw-bold mt-3">Messages</h5>
                  <p className="text-muted small">
                    Chat with your clients
                  </p>
                  <Link
                    href="/chat"
                    className="btn btn-outline-success btn-sm"
                  >
                    Open Messages
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* My Services */}
          <div className="card border-0 shadow-sm">
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
              <div className="text-center py-4 text-muted">
                <div style={{ fontSize: "3rem" }}>📋</div>
                <p className="mt-2">You have no services listed yet</p>
                <Link
                  href="/dashboard/provider/services/new"
                  className="btn btn-success btn-sm"
                >
                  List Your First Service
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}