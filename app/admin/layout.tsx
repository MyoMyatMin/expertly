"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthContext from "@/contexts/AuthProvider";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

// Define the navigation links for the Admin section
const navLinks = [
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/contributors", label: "Contributors" },
  { href: "/admin/users", label: "Users" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Get the current path for active route
  const { user } = useContext(AuthContext);
  // If we're on the /admin route, render nothing
  if (pathname === "/admin") {
    return null;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      {user && (user.role === "admin" || user.role === "moderator") && (
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 250, boxSizing: "border-box" },
          }}
        >
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.href} component={Link} href={link.href}>
                <ListItemText
                  primary={link.label}
                  sx={{
                    color: pathname === link.href ? "#ff006e" : "black",
                    textDecoration: "none",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
      <Divider orientation="vertical" flexItem />
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Let the main content take up the remaining space
          overflow: "auto", // Ensure scrollability if content overflows
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
