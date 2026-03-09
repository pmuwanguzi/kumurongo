import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PotentialDashboard() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.userType !== "POTENTIAL_PROVIDER") redirect("/dashboard");

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">

          {/* Welcome Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">
                Welcome, {session.user.name} 
              </h2>
              <p className="text-muted mb-0">
                Explore opportunities and find your path
              </p>
            </div>
            <span className="badge bg-warning text-dark px-3 py-2">
              Potential Provider
            </span>
          </div>

          {/* Info Banner */}
          <div className="alert alert-info border-0 mb-4" role="alert">
            <h6 className="fw-bold">🌟 How to get started</h6>
            <p className="mb-0 small">
              Browse services to see what others are offering, or check the
              unlisted service requests to find something you can provide.
              Once you claim a service, you will be upgraded to a full
              Service Provider automatically.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>🔍</div>
                  <h5 className="fw-bold mt-3">Browse Services</h5>
                  <p className="text-muted small">
                    See what services are being offered on the platform
                  </p>
                  <Link href="/services" className="btn btn-primary btn-sm">
                    Browse Services
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "2.5rem" }}>📣</div>
                  <h5 className="fw-bold mt-3">Unlisted Requests</h5>
                  <p className="text-muted small">
                    See what services clients are looking for
                  </p>
                  <Link
                    href="/service-requests"
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Requests
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}