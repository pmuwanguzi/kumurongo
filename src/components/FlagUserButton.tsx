"use client";

import { useState } from "react";

interface FlagUserButtonProps {
  flaggedUserId: string;
  flaggedUserName: string;
}

export default function FlagUserButton({
  flaggedUserId,
  flaggedUserName,
}: FlagUserButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please provide a reason");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flaggedUserId, reason, proof }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setReason("");
        setProof("");
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Flag Button */}
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => setShowModal(true)}
      >
        🚩 Flag User
      </button>

      {/* Modal Backdrop */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  🚩 Flag {flaggedUserName}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                {success ? (
                  <div className="alert alert-success border-0 mb-0">
                    ✅ Flag submitted successfully. Our team will review it.
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="alert alert-danger py-2 small">
                        {error}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Reason <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        <option value="">Select a reason...</option>
                        <option value="Fraudulent activity">
                          Fraudulent activity
                        </option>
                        <option value="Inappropriate behaviour">
                          Inappropriate behaviour
                        </option>
                        <option value="No show / Did not deliver">
                          No show / Did not deliver
                        </option>
                        <option value="Fake profile">Fake profile</option>
                        <option value="Harassment">Harassment</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Proof / Additional Details
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Describe what happened or provide any evidence..."
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                      />
                    </div>

                    <div className="alert alert-warning py-2 small border-0">
                      ⚠️ False reports may result in your account being
                      suspended. Only flag genuine concerns.
                    </div>
                  </>
                )}
              </div>
              {!success && (
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Flag"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}