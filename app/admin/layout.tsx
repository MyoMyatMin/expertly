"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // For active route highlighting

// Define the navigation links for the Admin section
const navLinks = [
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/contributors", label: "Contributors" },
  { href: "/admin/users", label: "Users" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Get the current path for active route

  // If we're on the /admin route, render nothing
  if (pathname === "/admin") {
    return null;
  }

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      {/* Navigation Bar */}
      <nav
        style={{
          backgroundColor: "#333",
          color: "white",
          padding: "10px 20px",
        }}
      >
        <ul style={{ listStyleType: "none", display: "flex", gap: "20px" }}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  color: pathname === link.href ? "yellow" : "white", // Highlight active link
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ padding: "20px", flexGrow: 1 }}>{children}</main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#333",
          color: "white",
          textAlign: "center",
          padding: "10px",
        }}
      >
        Admin Panel © 2024
      </footer>
    </div>
  );
};

export default AdminLayout;
