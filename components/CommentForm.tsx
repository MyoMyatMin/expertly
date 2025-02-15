import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

interface CommentFormProps {
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  replyingToUsername: string | null;
  setReplyCommentId: (id: string | null) => void;
  setReplyingToUsername: (username: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  newComment,
  setNewComment,
  handleAddComment,
  replyingToUsername,
  setReplyCommentId,
  setReplyingToUsername,
}) => (
  <Box sx={{ mt: 2 }}>
    {replyingToUsername && (
      <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
        Replying to: @{replyingToUsername}
        <Button
          size="small"
          onClick={() => {
            setReplyCommentId(null);
            setReplyingToUsername("");
          }}
        >
          Cancel
        </Button>
      </Typography>
    )}
    <Box sx={{ display: "flex" }}>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder={
          replyingToUsername ? "Write a reply..." : "Add a comment..."
        }
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button variant="contained" onClick={handleAddComment}>
        {replyingToUsername ? "Reply" : "Post"}
      </Button>
    </Box>
  </Box>
);

export default CommentForm;
