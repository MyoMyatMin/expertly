"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Post from "@/components/PostBox";
import ReportModal from "@/components/ReportModal";
import { Post as PostType, User } from "@/types/types";
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

  // Search related states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    users: User[];
    posts: PostType[];
  }>({ users: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);

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

  const handleReportSubmit = async (reason: string) => {
    if (!reportPostId || !user) return;

    try {
      await api.protected.reportPost(reportPostId, reason);
      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }

    setReportReason("");
    setCustomReason("");
    setReportPostId(null);
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults({ users: [], posts: [] });
      return;
    }

    setIsSearching(true);
    try {
      const [usersResponse, postsResponse] = await Promise.all([
        api.protected.searchUsers(searchQuery),
        api.protected.searchPosts(searchQuery),
      ]);
      console.log(usersResponse, postsResponse);
      setSearchResults({
        users: usersResponse || [],
        posts: postsResponse || [],
      });
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults({ users: [], posts: [] });
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setIsSearching(false);
        setSearchResults({ users: [], posts: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    getAllPosts();
    if (user) {
      getUserLikedPosts();
      getUserSavedPosts();
    }
  }, [user]);

  const shouldShowFollowingTab =
    user && !["admin", "moderator"].includes(user.role);

  const handleUserClick = (username: string) => {
    window.location.href = `/profile/${username}`;
  };

  const handlePostClick = (postId: string) => {
    window.location.href = `/posts/${postId}`;
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      {/* Search bar */}

      {user && (user.role === "user" || user.role === "contributor") && (
        <Box sx={{ mb: 3, position: "relative" }}>
          <TextField
            fullWidth
            placeholder="Search for users or posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          {/* Search results popup */}
          {isSearching && searchQuery && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                mt: 1,
                maxHeight: "70vh",
                overflow: "auto",
                p: 2,
              }}
            >
              {/* Users section */}
              <Typography variant="h6" sx={{ mb: 1 }}>
                Users
              </Typography>
              {searchResults.users.length > 0 ? (
                <List>
                  {searchResults.users.map((user) => (
                    <ListItem
                      component="a"
                      href="#"
                      key={user.user_id}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        handleUserClick(user.username ?? "");
                      }}
                      sx={{ borderRadius: 1, mb: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src="https://source.unsplash.com/random"
                          alt={user.username}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`@${user.username}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  No users found
                </Typography>
              )}

              {/* Divider */}
              <Divider sx={{ my: 2 }} />

              {/* Posts section */}
              <Typography variant="h6" sx={{ mb: 1 }}>
                Posts
              </Typography>
              {searchResults.posts.length > 0 ? (
                <List>
                  {searchResults.posts.map((post) => (
                    <ListItem
                      component="a"
                      key={post.PostID}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        handlePostClick(post.Slug);
                      }}
                      sx={{ borderRadius: 1, mb: 1, cursor: "pointer" }}
                    >
                      <ListItemText
                        primary={post.Title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              by {post.AuthorName}
                            </Typography>
                            {" — " +
                              post.Content.substring(0, 60) +
                              (post.Content.length > 60 ? "..." : "")}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No posts found
                </Typography>
              )}
            </Paper>
          )}
        </Box>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="For You" />
        {shouldShowFollowingTab && <Tab label="Following" />}
      </Tabs>

      <Box>
      {tabValue === 1 &&
        user?.suspended_until &&
        new Date(user.suspended_until) > new Date() ? (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              Your account is suspended.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                (window.location.href = `/profile/${user.username}`)
              }
            >
              Go to Profile
            </Button>
          </Box>
        ) : tabValue === 1 &&
          (!followingPosts || followingPosts.length === 0) ? (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              Your following does not have posts yet.
            </Typography>
          </Box>
        ) : (
          (tabValue === 0 ? posts ?? [] : followingPosts ?? []).map((post) => (
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
      />
    </Box>
  );
};

export default Feed;
