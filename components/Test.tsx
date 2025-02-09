"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FollowingTab from "@/components/FollowingTab";
import SavedPostsTab from "@/components/SavedPosts";
import PostsTab from "@/components/PostsTab";
import AppealsTab from "@/components/AppealTab";
import { api } from "@/helper/axiosInstance";
import { User, Post, Following } from "@/types/types";
import AuthContext from "@/contexts/AuthProvider";

const OtherUserProfilePage = () => {
  const router = useRouter();
  const { user: currentUser } = useContext(AuthContext);
  const { username } = useParams();

  const [userData, setUserData] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [followings, setFollowings] = useState<Following[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [contributorPosts, setContributorPosts] = useState<Post[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    username: "",
    name: "",
  });

  // Check if the profile belongs to the logged-in user using a unique id
  useEffect(() => {
    if (userData && currentUser) {
      setIsOwnProfile(userData.user_id === currentUser.user_id);
    }
  }, [currentUser, userData]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.protected.getProfileData(username as string);
      setUserData(response.user);
      setIsFollowing(response.user.is_following);
      setEditForm({
        username: response.user.username,
        name: response.user.name,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFollowings = async () => {
    try {
      const response = await api.protected.getFollowings(username as string);
      setFollowings(response);
    } catch (error) {
      console.error("Failed to fetch followings:", error);
    }
  };

  const getSavedPosts = async () => {
    try {
      const response = await api.protected.getSavedPosts(username as string);
      setSavedPosts(response);
    } catch (error) {
      console.error("Failed to fetch saved posts:", error);
    }
  };

  const getContributorPosts = async () => {
    try {
      const response = await api.protected.getPostsForContributor(
        username as string
      );
      setContributorPosts(response);
    } catch (error) {
      console.error("Failed to fetch contributor posts:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  useEffect(() => {
    // Load tab data based on tabValue and user role
    if (tabValue === 0) {
      getFollowings();
    }
    if (tabValue === 1) {
      getSavedPosts();
    }
    if (userData?.role === "contributor" && tabValue === 2) {
      getContributorPosts();
    }
  }, [tabValue, userData?.role]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.protected.unfollowUser(userData?.user_id as string);
      } else {
        await api.protected.followUser(userData?.user_id as string);
      }
      setIsFollowing(!isFollowing);
      fetchUserData();
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleTabChange = (_event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.protected.updateUser(editForm.name, editForm.username);
      setIsEditing(false);
      setError(null);
      if (editForm.username !== username) {
        router.push(`/profile/${editForm.username}`);
      } else {
        fetchUserData();
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError("Username already taken");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const getSuspensionDaysLeft = () => {
    if (!userData?.suspended_until) return null;
    const suspendedUntil = new Date("2099-12-31T23:59:59.999Z");
    const currentDate = new Date();
    const timeDiff = suspendedUntil.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : null;
  };

  const suspensionDaysLeft = getSuspensionDaysLeft();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  const tabLabels: string[] = [];
  if (suspensionDaysLeft && isOwnProfile) {
    tabLabels.push("Appeals");
  } else {
    tabLabels.push("Following", "Saved Posts");
    if (userData.role === "contributor") {
      tabLabels.push("Posts");
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
        <Avatar
          src={"https://randomuser.me/api/portraits/men/75.jpg"}
          alt="Profile Pic"
          sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
        />
        {isEditing ? (
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Username"
              name="username"
              value={editForm.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={!!error && error.includes("Username")}
              helperText={error && error.includes("Username") ? error : ""}
            />
            <TextField
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Box
              sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}
            >
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                  setEditForm({
                    username: userData.username || "",
                    name: userData.name,
                  });
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {userData.name}
              {userData.role === "contributor" && (
                <CheckCircleIcon sx={{ color: "blue", ml: 1 }} />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Followers: {userData.followers} | Following: {userData.following}
            </Typography>
            {suspensionDaysLeft && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                Suspended for {suspensionDaysLeft} more day(s)
              </Typography>
            )}
            {isOwnProfile ? (
              <Button variant="contained" onClick={handleEditProfile}>
                Edit Profile
              </Button>
            ) : (
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </>
        )}
      </Paper>

      <Paper elevation={0} sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tabLabels[tabValue] === "Following" && (
            <FollowingTab
              followings={followings}
              isOwnProfile={isOwnProfile}
              onUnfollow={getFollowings}
            />
          )}
          {tabLabels[tabValue] === "Saved Posts" && (
            <SavedPostsTab
              data={savedPosts}
              isOwnProfile={isOwnProfile}
              onUnsave={getSavedPosts}
            />
          )}
          {tabLabels[tabValue] === "Posts" && (
            <PostsTab data={contributorPosts} />
          )}
          {tabLabels[tabValue] === "Appeals" && <AppealsTab />}
        </Box>
      </Paper>
    </Box>
  );
};

export default OtherUserProfilePage;
