"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        GetMyDive
      </Link>

      <div className="navbar-links">
        <Link
          href="/spots"
          className={`navbar-link ${pathname === "/spots" ? "active" : ""}`}
        >
          Spots
        </Link>
        <Link
          href="/clubs"
          className={`navbar-link ${pathname === "/clubs" ? "active" : ""}`}
        >
          Clubs
        </Link>
        <Link
          href="/experiences"
          className={`navbar-link ${pathname === "/experiences" ? "active" : ""}`}
        >
          Expériences
        </Link>
      </div>
    </nav>
  );
}

