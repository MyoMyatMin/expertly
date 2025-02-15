"use client";
import { useAuth } from "@/contexts/AuthProvider"; // Adjust the import based on your context location
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

const withRole = (WrappedComponent: React.ComponentType, roles: string[]) => {
  const Wrapper = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);

      if (!user && !loading) {
        router.push("/auth/signin");
      }
    }, [user, loading, router]);

    // On first render (server + first client render), show loading
    // This ensures consistent rendering between server and client
    if (!mounted) {
      return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (loading) {
      return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!user || !roles.includes(user.role)) {
      return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            You do not have permission to access this page.
          </Typography>

          {user?.role !== "moderator" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`/profile/${user?.username || ""}`)}
            >
              Go to Your Profile
            </Button>
          )}
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
