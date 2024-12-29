"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  TextField,
  Button,
  Chip,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { CldUploadWidget } from "next-cloudinary";
import DeleteIcon from "@mui/icons-material/Delete";

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    asset_id: string;
    url: string;
  };
}

interface BlogEditorProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  selectedTags: string[];
  setSelectedTags: (selectedTags: string[]) => void;
  tags: { id: string; name: string }[];
  onSave: (data: {
    title: string;
    content: string;
    tags: string[];
    images: string[];
  }) => void;
  onImageUpload: (urls: string[]) => void;
}

function BlogEditor({
  title = "",
  setTitle,
  content = "",
  setContent,
  selectedTags = [],
  setSelectedTags,
  tags = [],
  onSave = () => {},
  onImageUpload = () => {},
}: BlogEditorProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [savedImageUrls, setSavedImageUrls] = useState<string[]>([]);

  const handleFileChange = (result: CloudinaryUploadResult) => {
    if (result.event === "success") {
      const uploadInfo = result.info;
      const newUrl = uploadInfo.secure_url;

      setImageUrls((prev) => {
        const updatedUrls = [...prev, newUrl];
        setSavedImageUrls((prevSaved) => {
          if (!prevSaved.includes(newUrl)) {
            return [...prevSaved, newUrl];
          }
          return prevSaved;
        });
        onImageUpload(updatedUrls);
        return updatedUrls;
      });
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    const imageUrlToDelete = imageUrls[indexToDelete];
    const markdownImageString = `![Image](${imageUrlToDelete})`;

    setContent(content.replace(markdownImageString, ""));
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToDelete);
    setImageUrls(updatedUrls);

    onImageUpload(updatedUrls);
  };

  const insertImagesToMarkdown = () => {
    const newMarkdownContent = imageUrls
      .map((url) => `\n![Image](${url})`)
      .join("");
    setContent(content + newMarkdownContent);
  };

  const handleTagChange = (tagId: string) => {
    const isSelected = selectedTags.includes(tagId);
    const updatedTags = isSelected
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(updatedTags);
  };

  const handleSave = () => {
    const blogPostData = {
      title,
      content,
      tags: selectedTags,
      images: savedImageUrls,
    };
    onSave(blogPostData);
  };

  return (
    <Box sx={{ maxWidth: "full", mx: "auto", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          height: "100%",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Write your markdown content here..."
            variant="outlined"
            multiline
            rows={10}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                color={selectedTags.includes(tag.id) ? "primary" : "default"}
                onClick={() => handleTagChange(tag.id)}
                variant={selectedTags.includes(tag.id) ? "filled" : "outlined"}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Upload Images:
            </Typography>

            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
              onSuccess={(result: any) => handleFileChange(result)}
            >
              {({ open }) => {
                return (
                  <Button
                    variant="outlined"
                    onClick={() => open()}
                    sx={{ mb: 2 }}
                  >
                    Upload an Image
                  </Button>
                );
              }}
            </CldUploadWidget>

            {imageUrls.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Uploaded Images:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {imageUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        maxWidth: "150px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteImage(index)}
                        sx={{
                          position: "absolute",
                          right: -10,
                          top: -10,
                          bgcolor: "background.paper",
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "white",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        style={{ width: "100%", marginBottom: "8px" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          wordWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {url}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={insertImagesToMarkdown}
                >
                  Insert Images into Markdown
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              overflow: "auto",
              bgcolor: "grey.900",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <ReactMarkdown>
              {content || "Your preview will appear here..."}
            </ReactMarkdown>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
}

export default BlogEditor;
