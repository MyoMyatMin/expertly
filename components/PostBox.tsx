"use client";
import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { ThumbUp, Comment, Report, Bookmark } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type PostProps = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
};

type PostComponentProps = {
  post: PostProps;
  onLike: (postId: string) => void;
  onReport: (postId: string) => void;
  onSave: (postId: string) => void;
  isLiked: boolean;
  isSaved: boolean;
};

const Post = ({
  post,
  onLike,
  onReport,
  onSave,
  isLiked,
  isSaved,
}: PostComponentProps) => {
  const router = useRouter();

  return (
    <Card
      sx={{ mb: 2, cursor: "pointer" }}
      onClick={() => router.push("/posts/" + post.id)}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {post.title}
        </Typography>

        <ReactMarkdown>{`${post.content.substring(0, 100)}...`}</ReactMarkdown>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
            >
              <ThumbUp color={isLiked ? "primary" : "inherit"} />
            </IconButton>
            <IconButton>
              <Comment />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onReport(post.id);
              }}
            >
              <Report />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onSave(post.id);
              }}
            >
              <Bookmark color={isSaved ? "primary" : "inherit"} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Post;
