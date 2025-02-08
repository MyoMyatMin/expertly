"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { api } from "@/helper/axiosInstance";
import { User } from "../../../types/types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FollowingTab from "@/components/FollowingTab";
import SavedPostsTab from "@/components/SavedPosts";
import PostsTab from "@/components/PostsTab";

const OtherUserProfilePage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [followings, setFollowings] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await api.protected.getProfileData(username as string);
      setUserData(response.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const getFollowings = async () => {
    try {
      const response = await api.protected.getFollowings(username as string);

      setFollowings(response);
      console.log("Followings", response);
    } catch (error) {
      console.error("Failed to fetch followings:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (tabValue === 0) {
      getFollowings();
    }
  }, [tabValue]);

  const handleTabChange = (
    _event: any,
    newValue: React.SetStateAction<number>
  ) => {
    setTabValue(newValue);
  };

  const handleFollow = () => {
    alert("Followed!");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
        <Avatar
          src="https://randomuser.me/api/portraits/men/75.jpg"
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
          {userData?.name}
          {userData?.role === "contributor" && (
            <CheckCircleIcon sx={{ color: "blue", ml: 1 }} />
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Followers: {userData?.followers} | Following: {userData?.following}
        </Typography>
        <Button variant="contained" onClick={handleFollow}>
          Follow
        </Button>
      </Paper>

      <Paper elevation={0} sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Following" />
          <Tab label="Saved Posts" />
          {userData?.role === "contributor" && <Tab label="Posts" />}
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && <FollowingTab followings={followings} />}
          {tabValue === 1 && <SavedPostsTab data={undefined} />}
          {userData?.role === "contributor" && tabValue === 2 && (
            <PostsTab data={undefined} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default OtherUserProfilePage;
