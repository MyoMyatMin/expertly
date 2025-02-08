import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { ThumbUp, Comment, Report, Bookmark } from "@mui/icons-material";

const ProfilePostCard = ({ post }: { post: any }) => {
  const router = useRouter();

  const handleUnsaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to unsave this post?")) {
    }
  };

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
            <Typography variant="body2" color="textSecondary">
              Upvotes: {post.UpvoteCount} | Comments: {post.CommentCount}
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></IconButton>
            <IconButton onClick={handleUnsaveClick}>
              <Bookmark color={"primary"} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePostCard;
