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
  Menu,
  MenuItem,
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
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (pathname === "/admin") {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", height: "91.5vh" }}>
      {user && (user.role === "admin" || user.role === "moderator") && (
        <>
          {/* Mobile Sidebar */}
          <Drawer
            variant="temporary"
            open={isSidebarOpen}
            onClose={toggleSidebar}
            sx={{
              display: { xs: "block", sm: "none" },
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

          {/* Desktop Sidebar */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: "background.default",
                position: "relative", // Ensures it scrolls with the page
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
          overflowY: "auto",
          p: 3,
        }}
      >
        {/* Mobile Menu Button */}
        {user && (user.role === "admin" || user.role === "moderator") && isMobile && (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ mb: 2 }}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.href}
                  component={Link}
                  href={link.href}
                  onClick={handleMenuClose}
                >
                  <ListItemText
                    primary={link.label}
                    sx={{
                      color: pathname === link.href ? "#ff006e" : "black",
                      textDecoration: "none",
                    }}
                  />
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;