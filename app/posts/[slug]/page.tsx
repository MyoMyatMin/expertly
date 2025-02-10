"use client";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import { ThumbUp, Comment, Edit, Delete, Reply } from "@mui/icons-material";
import { api } from "@/helper/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import AuthContext from "@/contexts/AuthProvider";

type CommentType = {
  id: string;
  content: string;
  parent_comment_id: string | null;
  post_id: string;
  user_id: string;
  replies: CommentType[];
  username: string;
  name: string;
};

const PostDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [postId, setPostId] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyingToUsername, setReplyingToUsername] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showFullBody, setShowFullBody] = useState(false);

  const { user: CurrentUser } = useContext(AuthContext);

  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await api.protected.getPostDetailsbySlug(
          slug as string
        );
        setPostId(postResponse.PostID);
        setTitle(postResponse.Title);
        setContent(postResponse.Content);
        setAuthorName(postResponse.AuthorName);
        setAuthorId(postResponse.UserID);
        setCreatedAt(
          new Date(postResponse.CreatedAt.Time).toLocaleDateString()
        );
        setUpvoteCount(postResponse.UpvoteCount);
        setCommentCount(postResponse.CommentCount);

        const commentsResponse = await api.protected.getPostCommentsBySlug(
          slug as string
        );
        setComments(commentsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [slug]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.protected.updatePost({
        id: postId,
        title,
        content,
        images,
      });

      console.log("Post updated successfully:", response.data);
      alert("Post updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      alert("Post deleted successfully!");
      router.push("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post. Please try again.");
    }
  };

  const handleUpvote = async () => {
    try {
      setUpvoteCount((prev) => (hasUpvoted ? prev - 1 : prev + 1));
      setHasUpvoted((prev) => !prev);
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const findCommentUsername = (
    commentId: string,
    commentsList: CommentType[]
  ): string => {
    for (const comment of commentsList) {
      if (comment.id === commentId) {
        return comment.username;
      }
      if (comment.replies) {
        const foundInReplies = findCommentUsername(commentId, comment.replies);
        if (foundInReplies) return foundInReplies;
      }
    }
    return "";
  };

  const handleReplyClick = (commentId: string) => {
    const username = findCommentUsername(commentId, comments);
    setReplyCommentId(commentId);
    setReplyingToUsername(username);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: CommentType = {
        id: Date.now().toString(),
        content: newComment,
        parent_comment_id: replyCommentId,
        post_id: postId,
        user_id: "currentUserId",
        replies: [],
        username: "currentUsername",
        name: "Current User",
      };

      const addReply = (commentList: CommentType[]): CommentType[] => {
        return commentList.map((comment) => {
          if (comment.id === replyCommentId) {
            return { ...comment, replies: [...comment.replies, newCommentObj] };
          } else if (comment.replies.length > 0) {
            return { ...comment, replies: addReply(comment.replies) };
          }
          return comment;
        });
      };

      setComments(
        replyCommentId ? addReply(comments) : [...comments, newCommentObj]
      );
      setCommentCount((prev) => prev + 1);
      setNewComment("");
      setReplyCommentId(null);
      setReplyingToUsername("");
    }
  };

  const renderComments = (comments: CommentType[]) => {
    return comments.map((comment) => (
      <Paper key={comment.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, cursor: "pointer" }}
          onClick={() => router.push(`/profile/${comment.username}`)}
        >
          {comment.name} (@{comment.username})
        </Typography>
        <Typography variant="body2">{comment.content}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <IconButton size="small" onClick={() => handleReplyClick(comment.id)}>
            <Reply fontSize="small" />
          </IconButton>
          <Typography variant="caption">Reply</Typography>
        </Box>
        {comment.replies?.length > 0 && (
          <Box sx={{ pl: 4, mt: 2 }}>{renderComments(comment.replies)}</Box>
        )}
      </Paper>
    ));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Box>
          {CurrentUser?.user_id === authorId && (
            <>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveEdit}
                    sx={{ mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <IconButton onClick={handleEdit}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={handleDelete}>
                    <Delete />
                  </IconButton>
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      {isEditing ? (
        <BlogEditor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onSave={handleSaveEdit}
          onImageUpload={setImages}
        />
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>{authorName[0]}</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {authorName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posted on {createdAt}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            {showFullBody ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <ReactMarkdown>{`${content.substring(0, 300)}...`}</ReactMarkdown>
            )}
            {content.length > 300 && (
              <Button
                size="small"
                onClick={() => setShowFullBody((prev) => !prev)}
              >
                {showFullBody ? "Read Less" : "Read More"}
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handleUpvote}>
                <ThumbUp color={hasUpvoted ? "primary" : "inherit"} />
              </IconButton>
              <Typography variant="caption">{upvoteCount} Votes</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton>
                <Comment />
              </IconButton>
              <Typography variant="caption">{commentCount} Comments</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Comments
          </Typography>
          {renderComments(comments)}
          <Box sx={{ mt: 2 }}>
            {replyCommentId && (
              <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                Replying to: @{replyingToUsername}
                <Button
                  size="small"
                  onClick={() => {
                    setReplyCommentId(null);
                    setReplyingToUsername("");
                  }}
                >
                  Cancel
                </Button>
              </Typography>
            )}
            <Box sx={{ display: "flex" }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder={
                  replyCommentId ? "Write a reply..." : "Add a comment..."
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button variant="contained" onClick={handleAddComment}>
                {replyCommentId ? "Reply" : "Post"}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PostDetail;
