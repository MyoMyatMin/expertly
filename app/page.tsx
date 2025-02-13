"use client";
import React, { useContext, useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import Post from "@/components/PostBox";
import ReportModal from "@/components/ReportModal";
import { Post as PostType } from "@/types/types";
import { api } from "@/helper/axiosInstance";
import AuthContext from "@/contexts/AuthProvider";

const removeImagesFromMarkdown = (markdown: string): string => {
  return markdown.replace(/!\[.*?\]\(.*?\)/g, "");
};

const Feed = () => {
  const [tabValue, setTabValue] = useState(0);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [followingPosts, setFollowingPosts] = useState<PostType[]>([]);
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostType[]>([]);

  const getAllPosts = async () => {
    try {
      const response = await api.public.getPosts();
      setPosts(response);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const getFollowingPosts = async () => {
    try {
      const response = await api.protected.getFollowingFeed();
      setFollowingPosts(response);
    } catch (error) {
      console.error("Error fetching following posts:", error);
    }
  };
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);
  const handleLike = (postId: string) =>
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  const handleSave = (postId: string) =>
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  const handleReportSubmit = (reason: string, details: string) => {
    console.log("Report Submitted:", { reason, details });
    alert("Report submitted successfully!");
    setReportReason("");
    setCustomReason("");
    setReportPostId(null);
  };

  useEffect(() => {
    getAllPosts();
    if (user) {
      getFollowingPosts();
    }
  }, [user]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="For You" />
        {user && <Tab label="Following" />}
      </Tabs>

      <Box>
        {(tabValue === 0 ? posts : followingPosts).map((post) => (
          <Post
            key={post.PostID}
            post={{
              ...post,
              Content: removeImagesFromMarkdown(post.Content),
            }}
            onLike={handleLike}
            onReport={(id: React.SetStateAction<string | null>) =>
              setReportPostId(id)
            }
            onSave={handleSave}
            isLiked={likedPosts.includes(post.PostID)}
            isSaved={savedPosts.includes(post.PostID)}
          />
        ))}
      </Box>

      <ReportModal
        open={!!reportPostId}
        onClose={() => setReportPostId(null)}
        onSubmit={handleReportSubmit}
        reportReason={reportReason}
        setReportReason={setReportReason}
        customReason={customReason}
        setCustomReason={setCustomReason}
      />
    </Box>
  );
};

export default Feed;
