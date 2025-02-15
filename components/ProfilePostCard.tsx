import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { ThumbUp, Comment, Bookmark } from "@mui/icons-material";
import { api } from "@/helper/axiosInstance";
import { Post } from "@/types/types";

interface ProfilePostCardProps {
  post: Post;
  showUnsaveButton?: boolean;
  onUnsave?: () => void;
}

const ProfilePostCard = ({
  post,
  showUnsaveButton = false,
  onUnsave,
}: ProfilePostCardProps) => {
  const router = useRouter();

  const handleUnsaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to unsave this post?")) {
      try {
        await api.protected.unsavePost(post.PostID);
        onUnsave?.();
      } catch (error) {
        console.error("Failed to unsave post:", error);
      }
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 3,
        },
      }}
      onClick={() => router.push(`/posts/${post.Slug}`)}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {post.Title}
        </Typography>
        <Box sx={{ my: 2 }}>
          <ReactMarkdown>{`${post.Content.substring(
            0,
            100
          )}...`}</ReactMarkdown>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThumbUp sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2" color="textSecondary">
                {post.UpvoteCount}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Comment sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2" color="textSecondary">
                {post.CommentCount}
              </Typography>
            </Box>
          </Box>
          {showUnsaveButton && (
            <IconButton
              onClick={handleUnsaveClick}
              sx={{ "&:hover": { color: "error.main" } }}
            >
              <Bookmark color="primary" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePostCard;
