import { Box, Typography } from "@mui/material";

const SavedPostsTab = ({ data }: { data: any }) => {
  if (!data?.length) return <Typography>No saved posts yet</Typography>;

  return (
    <Box>
      {data.map((post: any) => (
        <Box key={post.id} sx={{ mb: 3, p: 2, border: "1px solid #ddd" }}>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body2">{post.content}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SavedPostsTab;
