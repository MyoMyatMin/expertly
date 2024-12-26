"use client";
import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Post from "@/components/PostBox";
import ReportModal from "@/components/ReportModal";

const Feed = () => {
  const [tabValue, setTabValue] = useState(0);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const posts = [
    { id: "1", title: "Popular Post 1", content: "This is the first post content.", author: "John Doe", date: "2024-11-25" },
    { id: "2", title: "Popular Post 2", content: "Another exciting post to read.", author: "Jane Smith", date: "2024-11-26" },
  ];

  const followingPosts = [
    { id: "3", title: "Following Post 1", content: "This is the third post content.", author: "John Doe", date: "2024-11-27" },
    { id: "4", title: "Following Post 2", content: "Another exciting post to read.", author: "Jane Smith", date: "2024-11-28" },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabValue(newValue);
  const handleLike = (postId: string) => setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]));
  const handleSave = (postId: string) => setSavedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]));
  const handleReportSubmit = (reason: string, details: string) => {
    console.log("Report Submitted:", { reason, details });
    alert("Report submitted successfully!");
    setReportReason("");
    setCustomReason("");
    setReportPostId(null);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="For You" />
        <Tab label="Following" />
      </Tabs>

      <Box>
        {(tabValue === 0 ? posts : followingPosts).map((post) => (
          <Post
            key={post.id}
            post={post}
            onLike={handleLike}
            onReport={(id) => setReportPostId(id)}
            onSave={handleSave}
            isLiked={likedPosts.includes(post.id)}
            isSaved={savedPosts.includes(post.id)}
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
