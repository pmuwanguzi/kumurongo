"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EngagementActions({
  engagementId,
}: {
  engagementId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (status: "ACCEPTED" | "REJECTED" | "COMPLETED") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/engagements/${engagementId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating engagement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex gap-2">
      <button
        className="btn btn-success btn-sm"
        onClick={() => updateStatus("ACCEPTED")}
        disabled={isLoading}
      >
        ✓ Accept
      </button>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => updateStatus("REJECTED")}
        disabled={isLoading}
      >
        ✗ Reject
      </button>
    </div>
  );
}