"use client";
import React, { useContext, useState, useEffect } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { CldUploadWidget } from "next-cloudinary";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AuthContext from "@/contexts/AuthProvider";
import { api } from "@/helper/axiosInstance";
import { useRouter } from "next/navigation";
import { withRole } from "../hocs/withAuth";
import Image from "next/image";

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    asset_id: string;
    url: string;
  };
}

const ApplicationForm = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [expertiseLinks, setExpertiseLinks] = useState<string[]>([""]);
  const [identityProofUrl, setIdentityProofUrl] = useState("");
  const [submission, setSubmission] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpload = (result: CloudinaryUploadResult) => {
    if (result.event === "success") {
      setIdentityProofUrl(result.info.secure_url);
      console.log("Uploaded: ", result.info.secure_url);
    }
  };

  const handleAddExpertiseLink = () => {
    setExpertiseLinks([...expertiseLinks, ""]);
  };

  const handleRemoveExpertiseLink = (index: number) => {
    const newLinks = expertiseLinks.filter((_, i) => i !== index);
    setExpertiseLinks(newLinks);
  };

  const handleExpertiseLinkChange = (index: number, value: string) => {
    const newLinks = [...expertiseLinks];
    newLinks[index] = value;
    setExpertiseLinks(newLinks);
  };

  const createApplication = async () => {
    try {
      const response = await api.protected.createContributorApplication({
        expertiseLinks,
        identityProofUrl,
        submission,
      });
      console.log("Application created: ", response);
      router.push(`/profile/${user?.username}`);
    } catch (error) {
      console.error("Error creating application: ", error);
    }
  };

  const handleSubmit = () => {
    createApplication();
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
        disabled
        placeholder="Enter your name"
        sx={{ mb: 4 }}
      />

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Expertise Proof:
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Upload credentials (certifications, degrees, portfolio links)
      </Typography>

      {/* Expertise Links Inputs */}
      {expertiseLinks.map((link, index) => (
        <Box
          key={index}
          sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
        >
          <TextField
            fullWidth
            placeholder="Enter the link here"
            value={link}
            onChange={(e) => handleExpertiseLinkChange(index, e.target.value)}
          />
          {expertiseLinks.length > 1 && ( // Show remove button only if there's more than one input
            <IconButton
              onClick={() => handleRemoveExpertiseLink(index)}
              color="error"
              sx={{ border: "1px solid", borderColor: "error.main" }}
            >
              <RemoveIcon />
            </IconButton>
          )}
        </Box>
      ))}

      {/* Add Another Link Button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddExpertiseLink}
        sx={{ mb: 4 }}
      >
        Add Another Link
      </Button>

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Identity Proof:
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Government ID
      </Typography>
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
        onSuccess={(result: any) => handleUpload(result)}
      >
        {({ open }) => (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setIdentityProofUrl(""); // Clear existing image URL
              open();
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 4,
            }}
          >
            <UploadFileIcon sx={{ fontSize: 40, mb: 1 }} />
            Upload here
          </Button>
        )}
      </CldUploadWidget>
      {identityProofUrl && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Uploaded:
          </Typography>
          <Image
            src={identityProofUrl}
            alt="Identity Proof"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
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

export default withRole(ApplicationForm, ["user"]);
