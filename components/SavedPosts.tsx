import { Box, Typography } from "@mui/material";
import ProfilePostCard from "@/components/ProfilePostCard";
import { Post } from "@/types/types";

interface SavedPostsTabProps {
  data: Post[];
  isOwnProfile: boolean;
  onUnsave: () => void;
}

const SavedPostsTab = ({
  data,
  isOwnProfile,
  onUnsave,
}: SavedPostsTabProps) => {
  if (!data?.length) {
    return (
      <Typography sx={{ textAlign: "center", mt: 2 }}>
        No saved posts yet
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((post: Post) => (
        <ProfilePostCard
          key={post.PostID}
          post={post}
          showUnsaveButton={isOwnProfile}
          onUnsave={onUnsave}
        />
      ))}
    </Box>
  );
};

export default SavedPostsTab;
