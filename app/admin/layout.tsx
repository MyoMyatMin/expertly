"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          flexShrink: 0,
          width: "250px",
          backgroundColor: "#f8f9fa", //#f8f9fa
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {navLinks.map((link) => (
            <li key={link.href} style={{ marginBottom: "10px" }}>
              <Link
                href={link.href}
                style={{
                  color: pathname === link.href ? "#ff006e" : "black", 
                  textDecoration: "none",
                  padding: "10px",
                  display: "block",
                  borderRadius: "5px",
                  fontSize: "1.1rem",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div
        style={{
          width: "0.5px",
          backgroundColor: "#E0E0E0", 
          flexShrink: 0, 
        }}
      ></div>

      {/* Main Content */}
      <div
        style={{
          flexGrow: 1, // Let the main content take up the remaining space
          overflow: "auto", // Ensure scrollability if content overflows
        }}
      >{children}</div>
    </div>
  );
};

export default AdminLayout;
