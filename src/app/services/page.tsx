"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  provider: {
    id: string;
    name: string;
    isVerified: boolean;
    avgRating: number;
    reviewCount: number;
  };
}

const categories = [
  "All",
  "Home Repairs",
  "Tech Support",
  "Tutoring",
  "Creative Arts",
  "Transport",
  "Catering",
  "Beauty & Wellness",
  "Agriculture",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (selectedCategory !== "All") params.set("category", selectedCategory);

      const response = await fetch(`/api/services?${params.toString()}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-warning" : "text-muted"}>
        ★
      </span>
    ));
  };

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Browse Services</h2>
        <p className="text-muted">
          Find skilled service providers across Rwanda
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group input-group-lg shadow-sm">
          <input
            type="text"
            className="form-control border-end-0"
            placeholder="Search for a service or provider..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary px-4" type="submit">
            🔍 Search
          </button>
        </div>
      </form>

      {/* Category Filter */}
      <div className="d-flex flex-wrap gap-2 mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm rounded-pill ${
              selectedCategory === cat
                ? "btn-primary"
                : "btn-outline-secondary"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: "4rem" }}>🔍</div>
          <h5 className="mt-3">No services found</h5>
          <p className="text-muted">
            Try a different search or category
          </p>
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">
            {services.length} service{services.length !== 1 ? "s" : ""} found
          </p>
          <div className="row g-4">
            {services.map((service) => (
              <div key={service.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">

                    {/* Category Badge */}
                    <span className="badge bg-light text-primary border border-primary-subtle mb-2">
                      {service.category}
                    </span>

                    {/* Title */}
                    <h5 className="fw-bold mb-2">{service.title}</h5>

                    {/* Description */}
                    <p className="text-muted small mb-3" style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {service.description}
                    </p>

                    {/* Provider Info */}
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ width: 36, height: 36, fontSize: "0.85rem", flexShrink: 0 }}>
                        {service.provider.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-semibold small">
                          {service.provider.name}
                          {service.provider.isVerified && (
                            <span className="text-success ms-1">✓</span>
                          )}
                        </div>
                        <div className="small">
                          {renderStars(service.provider.avgRating)}
                          <span className="text-muted ms-1">
                            ({service.provider.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div>
                        {service.price ? (
                          <span className="fw-bold text-success">
                            RWF {service.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted small">
                            Price negotiable
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/services/${service.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}