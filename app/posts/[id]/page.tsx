"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar, Button, IconButton, TextField, Divider, Paper, } from "@mui/material";
import { ThumbUp, Comment, Edit, Delete } from "@mui/icons-material";

type Props = {};

const PostDetail = (props: Props) => {
  const [title, setTitle] = useState("How to Become a pro like M3");
  const [body] = useState(
    "This post explains how to build a Medium-like application with React and Material-UI. You will learn about components, state management, and styling. Feel free to further customize the form with additional validations or styles according to your applications needs! If you have any questions or need further modifications, let me know!This tutorial will guide you step by step. Lets dive in! If you still experience issues after this, please provide more context by including the relevant sections of your package.json, vite.config.ts, and any other files that seem related, which will help narrow down the problem further."
  );
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              label="Edit Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mr: 2 }}
            />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          )}
          <Box>
            {isEditing ? (
              <Button variant="contained" color="primary" onClick={handleSaveEdit}>
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

        <Typography variant="body1" sx={{ mb: 2 }}>
          {showFullBody ? body : `${body.substring(0, 300)}...`}
          {body.length > 300 && (
            <Button size="small" onClick={() => setShowFullBody((prev) => !prev)}>
              {showFullBody ? "Read Less" : "Read More"}
            </Button>
          )}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
