import { Box, Typography } from "@mui/material";
import ProfilePostCard from "@/components/ProfilePostCard";
const PostsTab = ({ data }: { data: any }) => {
  console.log("In PostTab", data);
  if (!data?.length) return <Typography>No posts yet</Typography>;

  return (
    <Box>
      {data.map((post: any, index: number) => (
        <ProfilePostCard key={index} post={post} />
      ))}
    </Box>
  );
};

export default PostsTab;
