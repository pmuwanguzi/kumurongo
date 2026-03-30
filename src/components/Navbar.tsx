"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link href="/" className="navbar-brand fw-bold fs-4">
          Kumurongo
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/services" className="nav-link">
                Browse Services
              </Link>
            </li>
            {session && (
              <li className="nav-item">
                <Link href="/chat" className="nav-link">
                  Messages
                </Link>
              </li>
            )}
          </ul>

          {/* Right side */}
          <ul className="navbar-nav ms-auto">
            {session ? (
              <>
                <li className="nav-item">
                  <Link
                    href={(() => {
                        const type = session.user.userType;
                        if (type === "SERVICE_PROVIDER") return "/dashboard/provider";
                        if (type === "POTENTIAL_PROVIDER") return "/dashboard/potential";
                        if (type === "SUPER_ADMIN") return "/dashboard/super-admin";
                        if (type === "ADMIN") return "/dashboard/admin";
                        return "/dashboard/client";
                      })()}
                    className="nav-link"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/signup"
                    className="btn btn-primary btn-sm ms-2"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}