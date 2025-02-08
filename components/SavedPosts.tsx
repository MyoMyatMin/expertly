import { Box, Typography } from "@mui/material";
import ProfilePostCard from "@/components/ProfilePostCard";

const SavedPostsTab = ({ data }: { data: any }) => {
  if (!data?.length) return <Typography>No saved posts yet</Typography>;

  return (
    <Box>
      {data.map((post: any, index: number) => (
        <ProfilePostCard key={index} post={post} />
      ))}
    </Box>
  );
};

export default SavedPostsTab;
