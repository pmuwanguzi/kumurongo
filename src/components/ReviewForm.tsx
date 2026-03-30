"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  engagementId: string;
  revieweeName: string;
}

export default function ReviewForm({
  engagementId,
  revieweeName,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!content.trim()) {
      setError("Please write a review");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engagementId, content, rating }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="alert alert-success border-0">
        ✅ Review submitted successfully! Thank you for your feedback.
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-1">Leave a Review</h5>
        <p className="text-muted small mb-4">
          Share your experience with {revieweeName}
        </p>

        {error && (
          <div className="alert alert-danger py-2 small">{error}</div>
        )}

        {/* Star Rating */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Rating</label>
          <div className="d-flex gap-1" style={{ fontSize: "2rem" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{ cursor: "pointer" }}
                className={
                  star <= (hoveredRating || rating)
                    ? "text-warning"
                    : "text-muted"
                }
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          {rating > 0 && (
            <small className="text-muted">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </small>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Your Review</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Describe your experience..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </div>
  );
}