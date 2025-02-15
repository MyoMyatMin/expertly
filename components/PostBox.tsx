"use client";
import React, { useContext } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { ThumbUp, Comment, Report, Bookmark } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Post as PostType } from "@/types/types";
import AuthContext from "@/contexts/AuthProvider";

type PostComponentProps = {
  tab: number;
  post: PostType;
  onLike: (postId: string) => void;
  onReport: (postId: string) => void;
  onSave: (postId: string) => void;
  isLiked: boolean;
  isSaved: boolean;
};

const Post = ({
  tab,
  post,
  onLike,
  onReport,
  onSave,
  isLiked,
  isSaved,
}: PostComponentProps) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  return (
    <Card
      sx={{ mb: 2, cursor: "pointer" }}
      onClick={() => router.push("/posts/" + post.Slug)}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {post.Title}
        </Typography>

        <ReactMarkdown>{`${post.Content.substring(0, 100)}...`}</ReactMarkdown>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.PostID);
              }}
            >
              <ThumbUp color={isLiked ? "primary" : "inherit"} />
            </IconButton>
            <Typography variant="body2" sx={{ display: "inline", ml: 1 }}>
              {post.UpvoteCount}
            </Typography>
            <IconButton>
              <Comment />
            </IconButton>
            <Typography variant="body2" sx={{ display: "inline", ml: 1 }}>
              {post.CommentCount}
            </Typography>
          </Box>
          <Box>
            {user && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onReport(post.PostID);
                }}
              >
                <Report />
              </IconButton>
            )}

            {user && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(post.PostID);
                }}
              >
                <Bookmark color={isSaved ? "primary" : "inherit"} />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Post;
