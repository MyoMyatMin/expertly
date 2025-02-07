"use client";
import { useContext } from "react";
import Profile from "../../components/Profile";
import AuthContext from "@/contexts/AuthProvider";

const ProfilePage = () => {
  const { user, loading } = useContext(AuthContext);

  const userData = {
    name: user?.name || "Jane Doe",
    bio: "Tech Enthusiast",
    profilePic: "/path-to-profile-pic.jpg",
  };
  if (loading) return <div>Loading...</div>;
  return <Profile isOwnProfile={true} posts={[]} {...userData} />;
};

export default ProfilePage;
