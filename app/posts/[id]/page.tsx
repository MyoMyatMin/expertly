"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import { ThumbUp, Comment, Edit, Delete } from "@mui/icons-material";
import { getPost } from "@/helper/getDummyData";

type Props = {};

const PostDetail = (props: Props) => {
  const post = getPost();
  const [isEditing, setIsEditing] = useState(false);
  const [showFullBody, setShowFullBody] = useState(false);
  const [comments, setComments] = useState<string[]>([
    "This is really helpful!",
    "Thanks for sharing this tutorial.",
  ]);
  const [newComment, setNewComment] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    alert("Post deleted!");
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            The Serene Beauty of Nature: A Visual Journey Through Architectural
            Elements
          </Typography>
          <Box>
            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
            ) : (
              <IconButton onClick={handleEdit}>
                <Edit />
              </IconButton>
            )}
            <IconButton onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ mr: 2 }}>JD</Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              John Doe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Posted on November 25, 2024
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          {showFullBody ? (
            <ReactMarkdown>{post.content}</ReactMarkdown>
          ) : (
            <ReactMarkdown>{`${post.content.substring(
              0,
              300
            )}...`}</ReactMarkdown>
          )}
          <Button size="small" onClick={() => setShowFullBody((prev) => !prev)}>
            {showFullBody ? "Read Less" : "Read More"}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <IconButton>
              <ThumbUp />
            </IconButton>
            <Typography variant="caption">24 Votes</Typography>
          </Box>
          <Box>
            <IconButton>
              <Comment />
            </IconButton>
            <Typography variant="caption">Comments</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Comments
        </Typography>
        {comments.map((comment, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2">{comment}</Typography>
          </Paper>
        ))}
        <Box sx={{ display: "flex", mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleAddComment}>
            Post
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PostDetail;
