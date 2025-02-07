"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

type Props = {
  isOwnProfile: boolean;
  name: string;
  bio: string;
  profilePic: string;
  posts: string[]; // Assume posts is an array of post content for the user
};

const Profile: React.FC<Props> = ({
  isOwnProfile,
  name,
  bio,
  profilePic,
  posts,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedBio, setUpdatedBio] = useState(bio);
  const [appealName, setAppealName] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [justification, setJustification] = useState("");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    if (newProfilePic) {
      // Update the profile pic
      const objectUrl = URL.createObjectURL(newProfilePic);
      // Set the updated profile pic if a new one is uploaded
    }
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewProfilePic(event.target.files[0]);
    }
  };

  const handleFollow = () => {
    // Handle follow functionality here
    alert("Followed!");
  };

  const handleSubmitAppeal = () => {
    alert("Appeal Submitted!");
    // Logic to submit the appeal form
  };

  return (
    <>
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
          {isEditing ? (
            <Box>
              <Avatar
                src={
                  newProfilePic
                    ? URL.createObjectURL(newProfilePic)
                    : profilePic
                }
                alt="Profile Pic"
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              />
              <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Upload New Picture
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <TextField
                fullWidth
                label="Name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Bio"
                value={updatedBio}
                onChange={(e) => setUpdatedBio(e.target.value)}
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mr: 2 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box>
              <Avatar
                src={profilePic}
                alt="Profile Pic"
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {updatedName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {updatedBio}
              </Typography>
              {isOwnProfile ? (
                <Button variant="outlined" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <Button variant="contained" onClick={handleFollow}>
                  Follow
                </Button>
              )}
            </Box>
          )}
        </Paper>

        <Paper elevation={0} sx={{ mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Following" />
            <Tab label="Saved Posts" />
            <Tab label="Posts" />
            {isOwnProfile && <Tab label="Appeals" />}
          </Tabs>
          <Box sx={{ p: 2 }}>
            {tabValue === 0 && (
              <Typography variant="body1">
                {isOwnProfile
                  ? "You are not following anyone yet."
                  : "Users haven't followed anyone yet"}
              </Typography>
            )}
            {tabValue === 1 && (
              <Typography variant="body1">No saved posts yet.</Typography>
            )}
            {tabValue === 2 && (
              <Box sx={{ maxWidth: 600, mx: "auto" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Posts
                </Typography>
                {posts.length === 0 ? (
                  <Typography>No posts yet.</Typography>
                ) : (
                  posts.map((post, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1">{post}</Typography>
                    </Box>
                  ))
                )}
              </Box>
            )}
            {tabValue === 3 && isOwnProfile && (
              <Box sx={{ maxWidth: 600, mx: "auto" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Appeal Form
                </Typography>
                <TextField
                  fullWidth
                  label="Name"
                  value={appealName}
                  onChange={(e) => setAppealName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Report Detail"
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Justification"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitAppeal}
                >
                  Submit Appeal
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Profile;
