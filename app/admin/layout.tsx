"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthContext from "@/contexts/AuthProvider";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  Theme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 200;

// Define the navigation links for the Admin section
const navLinks = [
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/contributors", label: "Contributors" },
  { href: "/admin/users", label: "Users" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user } = useContext(AuthContext);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm")); // Check if the screen is small
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility on mobile

  if (pathname === "/admin") {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Sidebar Navigation */}
      {user && (user.role === "admin" || user.role === "moderator") && (
        <>
          {/* Mobile Drawer (Temporary) */}
          <Drawer
            variant="temporary"
            open={isSidebarOpen}
            onClose={toggleSidebar}
            sx={{
              display: { xs: "block", sm: "none" }, // Only show on mobile
              width: drawerWidth,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: "background.default",
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

          {/* Desktop Drawer (Permanent) */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" }, 
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                mt: 8,
                bgcolor: "background.default",
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
        </>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml:
            user && (user.role === "admin" || user.role === "moderator") && !isMobile
              ? `${drawerWidth}px`
              : 0,
          p: 3,
          transition: "margin-left 0.3s",
        }}
      >
        {/* Mobile Menu Button */}
        {user && (user.role === "admin" || user.role === "moderator") && isMobile && (
          <IconButton onClick={toggleSidebar} sx={{ mb: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;