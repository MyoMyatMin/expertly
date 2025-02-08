import { Box, Typography } from "@mui/material";

const PostsTab = ({ data }: { data: any }) => {
  if (!data?.length) return <Typography>No posts yet</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      {data.map((post: any) => (
        <Box key={post.id} sx={{ mb: 3, p: 2, border: "1px solid #ddd" }}>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body2">{post.content}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PostsTab;
