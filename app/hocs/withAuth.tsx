"use client";
import { useAuth } from "@/contexts/AuthProvider"; // Adjust the import based on your context location
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

const withRole = (WrappedComponent: React.ComponentType, roles: string[]) => {
  const Wrapper = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();

    // Get username from URL parameters
    const urlUsername =
      typeof params.username === "string"
        ? params.username
        : Array.isArray(params.username)
        ? params.username[0]
        : null;

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      if (!user && !loading) {
        router.push("/auth/signin");
      }
    }, [user, loading, router]);

    if (!mounted || loading) {
      return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    // Check if user is suspended
    const isSuspended =
      user?.suspended_until && new Date(user.suspended_until) > new Date();

    // Allow user to visit their own profile, even if suspended
    if (user?.username === urlUsername) {
      return <WrappedComponent {...props} />;
    }

    // Block suspended users from accessing other profiles or pages
    if (isSuspended) {
      return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Your account is suspended. You can only access your own profile.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/profile/${user.username}`)}
          >
            Go to Your Profile
          </Button>
        </Box>
      );
    }

    // Check role restrictions for non-suspended users
    if (!user || !roles.includes(user.role)) {
      return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            You do not have permission to access this page.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/profile/${user?.username || ""}`)}
          >
            Go to Your Profile
          </Button>
        </Box>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

const WithContributor = (WrappedComponent: React.ComponentType) =>
  withRole(WrappedComponent, ["contributor"]);
const WithAdmin = (WrappedComponent: React.ComponentType) =>
  withRole(WrappedComponent, ["admin"]);
const WithModerator = (WrappedComponent: React.ComponentType) =>
  withRole(WrappedComponent, ["moderator", "admin"]);
const WithContributorOrUser = (WrappedComponent: React.ComponentType) =>
  withRole(WrappedComponent, ["contributor", "user"]);

export {
  withRole,
  WithContributor,
  WithAdmin,
  WithModerator,
  WithContributorOrUser,
};
