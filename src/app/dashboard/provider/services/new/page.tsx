"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  "Home Repairs",
  "Tech Support",
  "Tutoring",
  "Creative Arts",
  "Transport",
  "Catering",
  "Beauty & Wellness",
  "Agriculture",
  "Other",
];

export default function NewServicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      setError("Title, description and category are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Success — redirect back to provider dashboard
      router.push("/dashboard/provider?created=true");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">

          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <Link
              href="/dashboard/provider"
              className="btn btn-outline-secondary btn-sm me-3"
            >
              ← Back
            </Link>
            <div>
              <h3 className="fw-bold mb-0">Create a New Service</h3>
              <p className="text-muted small mb-0">
                Tell clients what you offer
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Service Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Professional Plumbing Services"
                  value={formData.title}
                  onChange={handleChange}
                />
                <small className="text-muted">
                  Keep it clear and descriptive
                </small>
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={5}
                  placeholder="Describe your service in detail — what you offer, your experience, and what clients can expect..."
                  value={formData.description}
                  onChange={handleChange}
                />
                <small className="text-muted">
                  {formData.description.length}/500 characters
                </small>
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Price (RWF)
                </label>
                <div className="input-group">
                  <span className="input-group-text">RWF</span>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="Leave empty if negotiable"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <small className="text-muted">
                  Optional — leave blank if price is negotiable
                </small>
              </div>

              {/* Submit */}
              <div className="d-flex gap-3">
                <button
                  className="btn btn-success px-5"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Service"
                  )}
                </button>
                <Link
                  href="/dashboard/provider"
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}