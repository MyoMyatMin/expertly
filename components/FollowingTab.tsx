import { Box, Typography, Link, Avatar } from "@mui/material";

const FollowingTab = ({ followings }: { followings: any }) => {
  console.log(followings);

  if (followings.length === 0) {
    return (
      <Box>
        <Typography variant="body1">
          User hasn't followed anyone yet.
        </Typography>
      </Box>
    );
  }

  const getRandomProfilePic = () => {
    const pics = [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/women/1.jpg",
      "https://randomuser.me/api/portraits/men/2.jpg",
      "https://randomuser.me/api/portraits/women/2.jpg",
      // Add more URLs as needed
    ];
    return pics[Math.floor(Math.random() * pics.length)];
  };

  return (
    <Box>
      {followings.map((following: any) => (
        <Box key={following.Username} display="flex" alignItems="center" mb={2}>
          <Avatar src={getRandomProfilePic()} alt={following.Name} />
          <Typography variant="body1" ml={2}>
            <Link href={`/profile/${following.Username}`} underline="hover">
              {following.Name}
            </Link>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default FollowingTab;
