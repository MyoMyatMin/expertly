"use client";
import { useParams } from "next/navigation";
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
} from "@mui/material";
import { api } from "@/helper/axiosInstance";
import { User, Post, Following } from "@/types/types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FollowingTab from "@/components/FollowingTab";
import SavedPostsTab from "@/components/SavedPosts";
import PostsTab from "@/components/PostsTab";
import AuthContext from "@/contexts/AuthProvider";

const OtherUserProfilePage = () => {
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

  useEffect(() => {
    setIsOwnProfile(currentUser?.username === username);
  }, [currentUser, username]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.protected.getProfileData(username as string);
      setUserData(response.user);
      setIsFollowing(response.isFollowing);
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
    if (tabValue === 0) {
      getFollowings();
    }
    if (tabValue === 1) {
      getSavedPosts();
    }
    if (tabValue === 2 && userData?.role === "contributor") {
      getContributorPosts();
    }
  }, [tabValue, userData?.role]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.protected.unfollowUser(username as string);
      } else {
        await api.protected.followUser(username as string);
      }
      setIsFollowing(!isFollowing);
      fetchUserData(); // Refresh user data to update follower count
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  const handleEditProfile = () => {
    window.location.href = `/profile/edit`;
  };

  const handleTabChange = (_event: any, newValue: number) => {
    setTabValue(newValue);
  };

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

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
        <Avatar
          src={"https://randomuser.me/api/portraits/men/75.jpg"}
          alt="Profile Pic"
          sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
        />
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
      </Paper>

      <Paper elevation={0} sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Following" />
          <Tab label="Saved Posts" />
          {userData.role === "contributor" && <Tab label="Posts" />}
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && (
            <FollowingTab
              followings={followings}
              isOwnProfile={isOwnProfile}
              onUnfollow={getFollowings}
            />
          )}
          {tabValue === 1 && (
            <SavedPostsTab
              data={savedPosts}
              isOwnProfile={isOwnProfile}
              onUnsave={getSavedPosts}
            />
          )}
          {userData.role === "contributor" && tabValue === 2 && (
            <PostsTab data={contributorPosts} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default OtherUserProfilePage;
