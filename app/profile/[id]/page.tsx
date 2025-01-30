"use client";
import { useParams } from "next/navigation";
import Profile from "../../../components/Profile";

const OtherUserProfilePage = () => {
  const { userId } = useParams();

  const userData = {
    name: "Jane Doe",
    bio: "Tech Enthusiast",
    profilePic: "/path-to-profile-pic.jpg",
  };

  return <Profile posts={[]} isOwnProfile={false} {...userData} />;
};

export default OtherUserProfilePage;
