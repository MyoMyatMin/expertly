import React from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { Reply } from "@mui/icons-material";

interface Comment {
  id: string;
  name: string;
  username: string;
  content: string;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  handleReplyClick: (id: string) => void;
  renderComments: (comments: Comment[]) => React.ReactNode;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  handleReplyClick,
  renderComments,
}) => (
  <Paper key={comment.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {comment.name} (@{comment.username})
    </Typography>
    <Typography variant="body2">{comment.content}</Typography>
    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
      <IconButton size="small" onClick={() => handleReplyClick(comment.id)}>
        <Reply fontSize="small" />
      </IconButton>
      <Typography variant="caption">Reply</Typography>
    </Box>
    {(comment.replies?.length ?? 0) > 0 && (
      <Box sx={{ pl: 4, mt: 2 }}>{renderComments(comment.replies ?? [])}</Box>
    )}
  </Paper>
);

export default CommentItem;
