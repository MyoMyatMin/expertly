"use client";
import React, { use } from "react";
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

const Header: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detects screens smaller than "sm" (600px)

  // For Mobile Menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

        {/* Search Bar (hidden on smaller screens) */}
        {!isMobile && (
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

        {/* Buttons and Menu */}
        {isMobile ? (
          <>
            {/* Mobile Menu Icon */}
            <IconButton onClick={handleMenuOpen}>
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ style: { minWidth: "150px" } }}
            >
              <MenuItem onClick={() => router.push("/application")}>
                <Whatshot sx={{ mr: 1 }} />
                To Contributor
              </MenuItem>
              <MenuItem onClick={() => router.push("/create")}>
                <Add sx={{ mr: 1 }} />
                Create
              </MenuItem>
              <MenuItem onClick={() => router.push("/admin")}>
                <AdminPanelSettings sx={{ mr: 1 }} />
                Admin
              </MenuItem>
              <MenuItem onClick={() => router.push("/profile")}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2, // Spacing between items
            }}
          >
            <Button
              variant="outlined"
              onClick={() => router.push("/application")}
              startIcon={<Whatshot />}
              sx={{ height: "40px" }}
            >
              To Contributor
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/create")}
              startIcon={<Add />}
              sx={{ height: "40px" }}
            >
              Create
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => router.push("/admin/contributors")}
              startIcon={<AdminPanelSettings />}
              sx={{ height: "40px" }}
            >
              Admin
            </Button>
            <AccountCircle
              sx={{
                color: "black",
                cursor: "pointer",
                fontSize: "36px",
              }}
              onClick={() => router.push("/profile")}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
