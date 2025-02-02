"use client";
import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";

type Props = {};

const ApplicationForm = (props: Props) => {
  const [name, setName] = useState("");
  const [expertiseLink, setExpertiseLink] = useState("");
  const [identityProof, setIdentityProof] = useState<File | null>(null);
  const [submission, setSubmission] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log({
      expertiseLink,
      identityProof,
      submission,
    });
    alert("Application submitted successfully!");
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 700, textAlign: "center" }}
      >
        Contributor Application Form
      </Typography>

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Name:
      </Typography>
      <TextField
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        sx={{ mb: 4 }}
      />

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Expertise Proof:
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Upload credentials (certifications, degrees, portfolio links)
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter the link here"
        value={expertiseLink}
        onChange={(e) => setExpertiseLink(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Identity Proof:
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Government ID
      </Typography>
      <Button
        variant="outlined"
        component="label"
        fullWidth
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
        }}
      >
        <UploadFileIcon sx={{ fontSize: 40, mb: 1 }} />
        Upload here
        <input
          type="file"
          hidden
          onChange={(e) => handleFileChange(e, setIdentityProof)}
        />
      </Button>
      {identityProof && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {identityProof.name}
        </Typography>
      )}

      <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: 600 }}>
        Initial Submission:
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Write your first test post"
        value={submission}
        onChange={(e) => setSubmission(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Box sx={{ textAlign: "center" }}>
        <IconButton
          color="primary"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            padding: 2,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ApplicationForm;
