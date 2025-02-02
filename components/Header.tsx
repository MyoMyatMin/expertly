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
import { useRouter } from "next/navigation";
import {
  Search,
  Whatshot,
  Add,
  AccountCircle,
  Menu as MenuIcon,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import AuthContext from "@/contexts/AuthProvider";
import Post from "@/components/PostBox";

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isSuperAdmin = user?.Role.String === "superadmin";
  const isAdmin =
    user?.Role.String === "superadmin" || user?.Role.String === "moderator";
  const isContributor = user?.Role.String === "contributor";
  console.log("User Role:", user?.Role.String, isContributor);
  const isRegularUser = !isAdmin && !isContributor;

  const renderMobileMenuItems = () => {
    if (!user) {
      return [
        <MenuItem key="signin" onClick={() => router.push("/auth/signin")}>
          <AccountCircle sx={{ mr: 1 }} />
          Signin
        </MenuItem>,
      ];
    }

    const menuItems = [];

    if (isSuperAdmin) {
      menuItems.push(
        <MenuItem key="create" onClick={() => router.push("/create")}>
          <Add sx={{ mr: 1 }} />
          Create
        </MenuItem>
      );
    }

    if (isContributor) {
      menuItems.push(
        <MenuItem key="createpost" onClick={() => router.push("/posts/create")}>
          <Add sx={{ mr: 1 }} />
          Create Post
        </MenuItem>
      );
    }

    if (isAdmin) {
      menuItems.push(
        <MenuItem
          key="admin"
          onClick={() => router.push("/admin/contributors")}
        >
          <AdminPanelSettings sx={{ mr: 1 }} />
          Admin
        </MenuItem>
      );
    }

    if (isRegularUser) {
      menuItems.push(
        <MenuItem
          key="to-contributor"
          onClick={() => router.push("/applicationform")}
        >
          <Add sx={{ mr: 1 }} />
          To Contributor
        </MenuItem>
      );
    }

    menuItems.push(
      <MenuItem key="profile" onClick={() => router.push("/profile")}>
        <AccountCircle sx={{ mr: 1 }} />
        Profile
      </MenuItem>,
      <MenuItem key="logout" onClick={logout}>
        <Whatshot sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    );

    return menuItems;
  };

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

        {/* Remove Search Bar if Admin */}
        {!isMobile && !isAdmin && (
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
        )}

        {isMobile ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ style: { minWidth: "150px" } }}
            >
              {renderMobileMenuItems()}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                {/* Show "Create" button only for superadmin */}
                {isSuperAdmin && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push("/admin/panel")}
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
                    onClick={() => router.push("/posts/create")}
                    startIcon={<Add />}
                    sx={{ height: "40px" }}
                  >
                    Create Post
                  </Button>
                )}
                <AccountCircle
                  sx={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "36px",
                  }}
                  onClick={() => router.push("/profile")}
                />
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
              <>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/auth/signin")}
                  startIcon={<AccountCircle />}
                  sx={{ height: "40px" }}
                >
                  Signin
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
