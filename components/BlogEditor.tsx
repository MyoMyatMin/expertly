"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Box, TextField, Button, Chip, Paper, Typography } from "@mui/material";

interface BlogEditorProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  selectedTags: string[];
  setSelectedTags: (selectedTags: string[]) => void;
  tags: { id: string; name: string }[];
  onSave: () => void;
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
}: BlogEditorProps) {
  const handleTagChange = (tagId: string) => {
    const isSelected = selectedTags.includes(tagId);
    const updatedTags = isSelected
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(updatedTags);
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
        {/* Left Column */}
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
                sx={{
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Right Column */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
          }}
        >
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

      {/* Save Button */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          onClick={onSave}
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
