import { Box, Typography, Avatar, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "@/helper/axiosInstance";
import { Following } from "@/types/types";

interface FollowingTabProps {
  followings: Following[];
  isOwnProfile: boolean;
  onUnfollow: () => void;
}

const FollowingTab = ({
  followings,
  isOwnProfile,
  onUnfollow,
}: FollowingTabProps) => {
  const router = useRouter();

  const handleUnfollow = async (userid: string) => {
    if (window.confirm("Are you sure you want to unfollow this user?")) {
      try {
        await api.protected.unfollowUser(userid);
        onUnfollow();
      } catch (error) {
        console.error("Failed to unfollow user:", error);
      }
    }
  };

  const handleProfileClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  if (!followings?.length) {
    return (
      <Typography sx={{ textAlign: "center", mt: 2 }}>
        Not following anyone yet
      </Typography>
    );
  }

  return (
    <Box>
      {followings.map((following: Following) => (
        <Box
          key={following.Name}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            p: 2,
            border: "1px solid #eee",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            },
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => handleProfileClick(following.Username)}
          >
            <Avatar
              src="https://source.unsplash.com/random"
              alt={following.Name}
              sx={{ width: 50, height: 50 }}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {following.Name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                @{following.Username}
              </Typography>
            </Box>
          </Box>
          {isOwnProfile && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleUnfollow(following.FollowingID)}
              sx={{
                "&:hover": {
                  backgroundColor: "error.light",
                  borderColor: "error.main",
                  color: "error.main",
                },
              }}
            >
              Unfollow
            </Button>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default FollowingTab;
