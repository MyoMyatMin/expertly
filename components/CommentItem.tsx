import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import { Edit, Delete, Reply } from "@mui/icons-material";
import { CommentType } from "@/types/types";
import AuthContext from "@/contexts/AuthProvider";

interface CommentItemProps {
  comment: CommentType;
  handleReplyClick: (commentId: string) => void;
  handleEditComment?: (commentId: string, newContent: string) => void;
  handleDeleteComment?: (commentId: string) => void;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  handleReplyClick,
  handleEditComment,
  handleDeleteComment,
  level = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const { user } = useContext(AuthContext);

  const isAuthor = user && user.username === comment.username;
  const isAdminOrMod =
    user && (user.role === "admin" || user.role === "moderator");
  const canEdit = isAuthor;
  const canDelete = isAuthor;
  const maxLevel = 5; // Limit nesting level for UI purposes
  const actualLevel = Math.min(level, maxLevel);

  const handleSaveEdit = () => {
    if (handleEditComment) {
      handleEditComment(comment.id, editedComment);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedComment(comment.content);
    setIsEditing(false);
  };

  return (
    <Box sx={{ mb: 2, ml: actualLevel * 2 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderLeft: actualLevel > 0 ? `4px solid #e0e0e0` : undefined,
          bgcolor:
            actualLevel % 2 === 1 ? "rgba(0, 0, 0, 0.02)" : "background.paper",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {comment.name} (@{comment.username})
        </Typography>
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              variant="outlined"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              sx={{ mb: 1, mt: 1 }}
            />
            <Box sx={{ display: "flex" }}>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ mt: 1, mb: 1, whiteSpace: "pre-wrap" }}
          >
            {comment.content}
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          {!isEditing && !isAdminOrMod && (
            <>
              <IconButton
                size="small"
                onClick={() => handleReplyClick(comment.id)}
              >
                <Reply fontSize="small" />
              </IconButton>
              <Typography variant="caption" sx={{ mr: 2 }}>
                Reply
              </Typography>
            </>
          )}
          {!isEditing && canEdit && handleEditComment && (
            <>
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <Edit fontSize="small" />
              </IconButton>
              <Typography variant="caption" sx={{ mr: 2 }}>
                Edit
              </Typography>
            </>
          )}
          {!isEditing && canDelete && handleDeleteComment && (
            <>
              <IconButton
                size="small"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <Delete fontSize="small" />
              </IconButton>
              <Typography variant="caption">Delete</Typography>
            </>
          )}
        </Box>
      </Paper>

      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              handleReplyClick={handleReplyClick}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
              level={actualLevel + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentItem;
