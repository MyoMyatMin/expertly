"use client";
import Profile from "../../components/Profile"; // Assuming Profile is in components folder

const userData = {
  name: "Jane Doe",
  bio: "Tech Enthusiast",
  profilePic: "/path-to-profile-pic.jpg",
};

const ProfilePage = () => {
  return <Profile isOwnProfile={true} posts={[]} {...userData} />;
};

export default ProfilePage;
