"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminActionsProps {
  userId: string;
  action: "verify" | "suspend";
  isSuspended?: boolean;
}

export default function AdminActions({
  userId,
  action,
  isSuspended,
}: AdminActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (actionType: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (action === "verify") {
    return (
      <button
        className="btn btn-success btn-sm"
        onClick={() => handleAction("verify")}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          "✓ Verify"
        )}
      </button>
    );
  }

  return (
    <button
      className={`btn btn-sm ${
        isSuspended ? "btn-success" : "btn-danger"
      }`}
      onClick={() =>
        handleAction(isSuspended ? "unsuspend" : "suspend")
      }
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="spinner-border spinner-border-sm" />
      ) : isSuspended ? (
        "✓ Unsuspend"
      ) : (
        "⊘ Suspend"
      )}
    </button>
  );
}