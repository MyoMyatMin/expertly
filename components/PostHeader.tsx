import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { User } from "@/types/types";
import { useRouter } from "next/navigation";

interface PostHeaderProps {
  title: string;
  isEditing: boolean;
  handleEdit: () => void;
  handleDelete: () => void;
  handleSaveEdit: () => void;
  setIsEditing: (isEditing: boolean) => void;
  authorId: string;
  authorName: string;
  authorUsername: string;
  currentUser: User | null;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  isEditing,
  handleEdit,
  handleDelete,
  setIsEditing,
  authorId,
  authorName,
  authorUsername,
  currentUser,
}) => {
  const router = useRouter();

  const handleAuthorClick = () => {
    router.push(`/profile/${authorUsername}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography
          component="span"
          variant="subtitle1"
          sx={{
            color: "text.secondary",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={handleAuthorClick}
        >
          By {authorName}
        </Typography>
      </Box>
      {currentUser?.user_id === authorId && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <IconButton onClick={handleEdit}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <Delete />
              </IconButton>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PostHeader;
