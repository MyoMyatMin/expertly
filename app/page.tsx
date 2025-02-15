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
  const [followingPosts, setFollowingPosts] = useState<PostType[] | null>(null);
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

  const getUserLikedPosts = async () => {
    if (user && (user.role === "user" || user.role === "contributor")) {
      try {
        const response = await api.protected.getLikedPosts();
        setLikedPosts(response?.map((post: PostType) => post.PostID));
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    }
  };

  const getUserSavedPosts = async () => {
    if (user && (user.role === "user" || user.role === "contributor")) {
      try {
        const response = await api.protected.getSavedPosts(
          user.username as string
        );
        setSavedPosts(response?.map((post: PostType) => post.PostID));
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 1 && user) {
      getFollowingPosts();
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    const isCurrentlyLiked = likedPosts?.includes(postId);

    // Optimistically update UI
    setLikedPosts((prev) =>
      isCurrentlyLiked
        ? (prev ?? []).filter((id) => id !== postId)
        : [...(prev ?? []), postId]
    );

    // Update post like count in the UI for "For You" tab
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.PostID === postId
          ? {
              ...post,
              UpvoteCount: isCurrentlyLiked
                ? (post.UpvoteCount ?? 0) - 1
                : (post.UpvoteCount ?? 0) + 1,
            }
          : post
      )
    );

    // Update post like count in the UI for "Following" tab if it exists
    if (followingPosts) {
      setFollowingPosts((prevPosts) =>
        prevPosts
          ? prevPosts.map((post) =>
              post.PostID === postId
                ? {
                    ...post,
                    UpvoteCount: isCurrentlyLiked
                      ? (post?.UpvoteCount ?? 0) - 1
                      : (post?.UpvoteCount ?? 0) + 1,
                  }
                : post
            )
          : null
      );
    }

    try {
      // Call API to update like on server
      if (!isCurrentlyLiked) {
        await api.protected.likePost(postId);
      } else {
        await api.protected.unlikePost(postId);
      }
    } catch (error) {
      console.error("Error updating like:", error);

      // Revert UI changes if API call fails
      setLikedPosts((prev) =>
        isCurrentlyLiked
          ? [...prev, postId]
          : prev.filter((id) => id !== postId)
      );

      // Revert post like count in the UI for "For You" tab
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.PostID === postId
            ? {
                ...post,
                UpvoteCount: isCurrentlyLiked
                  ? (post.UpvoteCount ?? 0) + 1
                  : (post.UpvoteCount ?? 0) - 1,
              }
            : post
        )
      );

      // Revert post like count in the UI for "Following" tab if it exists
      if (followingPosts) {
        setFollowingPosts((prevPosts) =>
          prevPosts
            ? prevPosts.map((post) =>
                post.PostID === postId
                  ? {
                      ...post,
                      UpvoteCount: isCurrentlyLiked
                        ? (post.UpvoteCount ?? 0) + 1
                        : (post.UpvoteCount ?? 0) - 1,
                    }
                  : post
              )
            : null
        );
      }
    }
  };

  const handleSave = async (postId: string) => {
    if (!user) return;

    const isCurrentlySaved = savedPosts?.includes(postId);

    // Optimistically update UI
    setSavedPosts((prev) =>
      isCurrentlySaved
        ? prev?.filter((id) => id !== postId)
        : [...(prev ?? []), postId]
    );

    try {
      // Call API to update saved status on server
      if (!isCurrentlySaved) {
        await api.protected.savePost(postId);
      } else {
        await api.protected.unsavePost(postId);
      }
    } catch (error) {
      console.error("Error updating saved status:", error);

      // Revert UI changes if API call fails
      setSavedPosts((prev) =>
        isCurrentlySaved
          ? [...prev, postId]
          : prev.filter((id) => id !== postId)
      );
    }
  };

  const handleReportSubmit = async (reason: string, details: string) => {
    if (!reportPostId || !user) return;

    try {
      await api.protected.reportPost(reportPostId, reason, details);
      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }

    setReportReason("");
    setCustomReason("");
    setReportPostId(null);
  };

  useEffect(() => {
    getAllPosts();
    if (user) {
      getUserLikedPosts();
      getUserSavedPosts();
    }
  }, [user]);

  const shouldShowFollowingTab =
    user && !["admin", "moderator"].includes(user.role);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="For You" />
        {shouldShowFollowingTab && <Tab label="Following" />}
      </Tabs>

      <Box>
        {tabValue === 1 && (!followingPosts || followingPosts.length === 0) ? (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              Your following does not have posts yet.
            </Typography>
          </Box>
        ) : (
          (tabValue === 0 ? posts : followingPosts ?? []).map((post) => (
            <Post
              key={post.PostID}
              tab={tabValue}
              post={{
                ...post,
                Content: removeImagesFromMarkdown(post.Content),
              }}
              onLike={handleLike}
              onReport={(id: React.SetStateAction<string | null>) =>
                setReportPostId(id)
              }
              onSave={handleSave}
              isLiked={likedPosts?.includes(post.PostID)}
              isSaved={savedPosts?.includes(post.PostID) ?? false}
            />
          ))
        )}
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
