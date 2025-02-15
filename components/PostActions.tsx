import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ThumbUp, Comment } from "@mui/icons-material";

interface PostActionsProps {
  upvoteCount: number;
  hasUpvoted: boolean;
  handleUpvote: () => void;
  commentCount: number;
  isAdminOrModerator: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({
  upvoteCount,
  hasUpvoted,
  handleUpvote,
  commentCount,
  isAdminOrModerator,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {!isAdminOrModerator ? (
        <>
          <IconButton onClick={handleUpvote}>
            <ThumbUp color={hasUpvoted ? "primary" : "inherit"} />
          </IconButton>
          <Typography variant="caption">{upvoteCount} Votes</Typography>
        </>
      ) : (
        <>
          <IconButton disabled>
            <ThumbUp color={"primary"} />
          </IconButton>
          <Typography variant="caption">{upvoteCount} Votes</Typography>
        </>
      )}
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton>
        <Comment />
      </IconButton>
      <Typography variant="caption">{commentCount} Comments</Typography>
    </Box>
  </Box>
);

export default PostActions;
