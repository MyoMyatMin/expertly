"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar, Button, TextField, Tabs, Tab, Paper, } from "@mui/material";

type Props = {};

const Profile: React.FC<Props> = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [bio, setBio] = useState(
    "Passionate writer | Tech Enthusiast | Lover of coffee and books"
  );
  const [profilePic, setProfilePic] = useState("/path-to-profile-pic.jpg");
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);

  // Appeals form state
  const [appealName, setAppealName] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [justification, setJustification] = useState("");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    if (newProfilePic) {
      setProfilePic(URL.createObjectURL(newProfilePic));
    }
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewProfilePic(event.target.files[0]);
    }
  };

  const handleAppealSubmit = () => {
    console.log("Appeal Submitted:", { appealName, reportDetail, justification });
    setAppealName("");
    setReportDetail("");
    setJustification("");
    alert("Appeal submitted successfully!");
  };

  return (
    <>
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
          {isEditing ? (
            <Box>
              <Avatar
                src={newProfilePic ? URL.createObjectURL(newProfilePic) : profilePic}
                alt="Profile Pic"
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              />
              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 2 }}
              >
                Upload New Picture
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
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
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {bio}
              </Typography>
              <Button variant="outlined" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </Box>
          )}
        </Paper>

        <Paper elevation={0} sx={{ mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Following" />
            <Tab label="Saved Posts" />
            <Tab label="Appeals" />
          </Tabs>
          <Box sx={{ p: 2 }}>
            {tabValue === 0 && (
              <Typography variant="body1">You are not following anyone yet.</Typography>
            )}
            {tabValue === 1 && (
              <Typography variant="body1">No saved posts yet.</Typography>
            )}
            {tabValue === 2 && (
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
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Justification"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAppealSubmit}
                >
                  Submit
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
