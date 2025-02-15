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
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

const drawerWidth = 250;

// Define the navigation links for the Admin section
const navLinks = [
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/contributors", label: "Contributors" },
  { href: "/admin/users", label: "Users" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user } = useContext(AuthContext);

  if (pathname === "/admin") {
    return null;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Top Header */}

      {/* Sidebar Navigation */}
      {user && (user.role === "admin" || user.role === "moderator") && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              mt: 8,
            },
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
          flexGrow: 1,
          overflow: "auto",
          mt: 8, // Ensure the content is pushed down below the header
          ml:
            user && (user.role === "admin" || user.role === "moderator")
              ? `${drawerWidth}px`
              : 0,
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
