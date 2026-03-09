import Link from "next/link";

const categories = [
  { icon: "🔧", name: "Home Repairs", description: "Plumbing, electrical, carpentry" },
  { icon: "💻", name: "Tech Support", description: "Computer repair, software help" },
  { icon: "📚", name: "Tutoring", description: "Academic and skills training" },
  { icon: "🎨", name: "Creative Arts", description: "Design, photography, crafts" },
  { icon: "🚗", name: "Transport", description: "Delivery, moving, errands" },
  { icon: "🍳", name: "Catering", description: "Cooking, events, meal prep" },
  { icon: "💇", name: "Beauty & Wellness", description: "Hair, makeup, massage" },
  { icon: "🌱", name: "Agriculture", description: "Farming, gardening, livestock" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-4 fw-bold mb-3">
                Find the Right Person for Any Job
              </h1>
              <p className="lead mb-4">
                Kumurongo connects you with skilled service providers across
                Rwanda — professionals and non-professionals alike. Everyone
                has something to offer.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link href="/services" className="btn btn-light btn-lg px-4">
                  Browse Services
                </Link>
                <Link
                  href="/signup"
                  className="btn btn-outline-light btn-lg px-4"
                >
                  Offer a Service
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <div style={{ fontSize: "5rem" }}>Kumurongo</div>
              <p className="mt-2 opacity-75">
                Connecting skills with opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-4 border-bottom">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">Free</h3>
              <small className="text-muted">To Sign Up</small>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">All Skills</h3>
              <small className="text-muted">Welcome Here</small>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">Verified</h3>
              <small className="text-muted">Service Providers</small>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">Rwanda</h3>
              <small className="text-muted">Based Platform</small>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Browse by Category</h2>
            <p className="text-muted">
              Find services across a wide range of categories
            </p>
          </div>
          <div className="row g-4">
            {categories.map((cat) => (
              <div key={cat.name} className="col-6 col-md-4 col-lg-3">
                <Link
                  href={`/services?category=${cat.name}`}
                  className="text-decoration-none"
                >
                  <div className="card h-100 text-center p-3 border-0 shadow-sm">
                    <div style={{ fontSize: "2.5rem" }}>{cat.icon}</div>
                    <h6 className="fw-bold mt-2 mb-1 text-dark">{cat.name}</h6>
                    <small className="text-muted">{cat.description}</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href="/services" className="btn btn-primary px-5">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How Kumurongo Works</h2>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 64, height: 64, fontSize: "1.8rem" }}>
                1️⃣
              </div>
              <h5 className="fw-bold">Create an Account</h5>
              <p className="text-muted">
                Sign up as a client looking for services, or as a service
                provider ready to offer your skills.
              </p>
            </div>
            <div className="col-md-4">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 64, height: 64, fontSize: "1.8rem" }}>
                2️⃣
              </div>
              <h5 className="fw-bold">Connect</h5>
              <p className="text-muted">
                Browse services, find the right provider, and chat with them
                directly on the platform.
              </p>
            </div>
            <div className="col-md-4">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 64, height: 64, fontSize: "1.8rem" }}>
                3️⃣
              </div>
              <h5 className="fw-bold">Get It Done</h5>
              <p className="text-muted">
                Confirm the engagement, get the work done, and leave a review
                to help others in the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
          <p className="lead mb-4">
            Join thousands of Rwandans connecting skills with opportunities
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/signup" className="btn btn-light btn-lg px-5">
              Sign Up Free
            </Link>
            <Link
              href="/services"
              className="btn btn-outline-light btn-lg px-5"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="fw-bold">Kumurongo</h5>
              <p className="text-muted small">
                Connecting service providers with clients across Rwanda.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <small className="text-muted">
                © 2026 Kumurongo. All rights reserved.
              </small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}