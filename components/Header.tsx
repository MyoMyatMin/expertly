"use client";

import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Whatshot,
  Add,
  AccountCircle,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import AuthContext from "@/contexts/AuthProvider";

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();
  const currentPath = usePathname();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Suspended logic: returns true if the user's suspended_until date is in the future.
  const isUserSuspended = () => {
    console.log(user);
    if (!user?.suspended_until) return false;
    const suspendedUntil = new Date(user.suspended_until);
    return suspendedUntil > new Date();
  };

  const isSuperAdmin = user?.role === "admin";
  const isAdmin = user?.role === "admin" || user?.role === "moderator";
  const isContributor = user?.role === "contributor";
  const isRegularUser = !isAdmin && !isContributor;

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#f8f9fa" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        {/* Logo */}
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 700, cursor: "pointer", color: "black" }}
          onClick={() => router.push("/")}
        >
          Expertly
        </Typography>

        {/* {!isAdmin && !isUserSuspended() && currentPath === "/" && (
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            sx={{ width: "300px", mx: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        )} */}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              {isSuperAdmin && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isUserSuspended()}
                  onClick={() => router.push("/admin/create")}
                  startIcon={<Add />}
                  sx={{ height: "40px" }}
                >
                  Create
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isUserSuspended()}
                  onClick={() => router.push("/admin/contributors")}
                  startIcon={<AdminPanelSettings />}
                  sx={{ height: "40px" }}
                >
                  Admin
                </Button>
              )}
              {isRegularUser && (
                <Button
                  variant="contained"
                  color="info"
                  disabled={isUserSuspended()}
                  onClick={() => router.push("/applicationform")}
                  startIcon={<Add />}
                  sx={{ height: "40px" }}
                >
                  To Contributor
                </Button>
              )}
              {isContributor && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isUserSuspended()}
                  onClick={() => router.push("/posts/create")}
                  startIcon={<Add />}
                  sx={{ height: "40px" }}
                >
                  Create Post
                </Button>
              )}
              {isAdmin ? (
                <Typography
                  variant="h6"
                  sx={{
                    color: "black",
                    cursor: "default",
                    fontWeight: "bold",
                    ml: 2,
                  }}
                >
                  {user.name}
                </Typography>
              ) : (
                <AccountCircle
                  sx={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "36px",
                  }}
                  onClick={() => router.push(`/profile/${user.username}`)}
                />
              )}
              <Button
                variant="outlined"
                onClick={logout}
                startIcon={<Whatshot />}
                sx={{ height: "40px" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={() => router.push("/auth/signin")}
              startIcon={<AccountCircle />}
              sx={{ height: "40px" }}
            >
              Signin
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
