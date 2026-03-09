"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "CLIENT",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Frontend validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Success — redirect to login
      router.push("/login?registered=true");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">

            {/* Card */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">

                {/* Header */}
                <div className="text-center mb-4">
                  <Link href="/" className="text-decoration-none">
                    <h2 className="fw-bold text-primary">Kumurongo</h2>
                  </Link>
                  <h4 className="fw-semibold mt-2">Create your account</h4>
                  <p className="text-muted small">
                    Join thousands of Rwandans on the platform
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger py-2 small" role="alert">
                    {error}
                  </div>
                )}

                {/* Form */}
                <div>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Account Type */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      I want to
                    </label>
                    <select
                      name="userType"
                      className="form-select"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="CLIENT">
                        Hire — Find services I need
                      </option>
                      <option value="SERVICE_PROVIDER">
                        Work — Offer my skills
                      </option>
                      <option value="POTENTIAL_PROVIDER">
                        Explore — Looking for opportunities
                      </option>
                    </select>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Repeat your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    className="btn btn-primary w-100 py-2"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>

                {/* Login Link */}
                <p className="text-center text-muted small mt-4 mb-0">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary fw-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}