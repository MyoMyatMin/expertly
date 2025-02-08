import { Card, CardContent, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

const ProfilePostCard = ({ post }: { post: any }) => {
  const router = useRouter();

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
        <Typography variant="body2" color="textSecondary">
          Upvotes: {post.UpvoteCount} | Comments: {post.CommentCount}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfilePostCard;
