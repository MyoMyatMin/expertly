"use client";
import React, { useState, useContext, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import AuthContext from "@/contexts/AuthProvider";
import { withRole } from "@/app/hocs/withAuth";
import PostHeader from "@/components/PostHeader";
import PostContent from "@/components/PostContent";
import PostActions from "@/components/PostActions";
import CommentItem from "@/components/CommentItem";
import CommentForm from "@/components/CommentForm";
import { Box, Paper } from "@mui/material";
import { Post } from "@/types/types";
import { CommentType } from "../../../types/types";
import { api } from "@/helper/axiosInstance";
import { get } from "http";

const PostDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showFullBody, setShowFullBody] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [replyingToUsername, setReplyingToUsername] = useState("");
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const getPost = async () => {
    try {
      const response = await api.protected.getPostDetailsbySlug(slug as string);
      setPost(response);
      console.log("Post details", response?.HasUpvoted);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const getComments = async () => {
    try {
      const response = await api.protected.getPostCommentsBySlug(
        slug as string
      );
      setComments(response);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, [slug]);

  if (!post) return <p>Loading...</p>;

  const handleEdit = () => setIsEditing(true);
  const handleSaveEdit = async () => {
    if (!post) return;

    try {
      const response = await api.protected.updatePost({
        id: post.PostID,
        title: post.Title,
        content: post.Content,
        images: images,
      });

      setPost(response);
      router.push(`/posts/${response.Slug}`);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post. Please try again.");
    }
  };

  const handleDelete = () => {
    if (!post) return;

    if (confirm("Are you sure you want to delete this post?")) {
      api.protected.deletePost(post.PostID);
      router.push("/");
    }
  };

  const handleUpvote = async () => {
    if (!post) return;

    try {
      // If the post has already been upvoted, un-upvote it
      if (post.HasUpvoted) {
        await api.protected.unlikePost(post.PostID);
        setPost({
          ...post,
          UpvoteCount: (post.UpvoteCount ?? 0) - 1,
          HasUpvoted: false,
        });
      } else {
        // Otherwise, upvote the post
        await api.protected.likePost(post.PostID);
        setPost({
          ...post,
          UpvoteCount: (post.UpvoteCount ?? 0) + 1,
          HasUpvoted: true,
        });
      }
    } catch (error) {
      console.error("Error handling upvote:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Avoid adding empty comments

    try {
      const newCommentData = {
        content: newComment,
        postId: post?.PostID,
        replyingToCommentId: replyCommentId || null,
      };

      const response = await api.protected.addComment(
        newCommentData.postId,
        newCommentData.content,
        newCommentData.replyingToCommentId || ""
      );

      getComments();
      getPost();
      setNewComment("");
      setReplyCommentId(null);
      setReplyingToUsername("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("An error occurred while adding the comment. Please try again.");
    }
  };

  const handleEditComment = (commentId: string, newContent: string) => {
    try {
      const response = api.protected.editComment(
        post.PostID,
        commentId,
        newContent
      );
      getComments();
      getPost();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.protected.deleteComment(post.PostID, commentId);
      getComments();
      getPost();
    } catch (error) {
      console.error("Error deleting comment:", error);
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

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <PostHeader
        title={post.Title}
        isEditing={isEditing}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleSaveEdit={handleSaveEdit}
        setIsEditing={setIsEditing}
        authorId={post.UserID}
        authorName={post.AuthorName ?? ""}
        authorUsername={post.AuthorUsername ?? ""}
        currentUser={user}
      />
      {isEditing ? (
        <BlogEditor
          title={post.Title}
          content={post.Content}
          setTitle={(title) => setPost({ ...post, Title: title })}
          setContent={(content) => setPost({ ...post, Content: content })}
          onSave={handleSaveEdit}
          onImageUpload={setImages}
        />
      ) : (
        <>
          <PostContent
            content={post.Content}
            showFullBody={showFullBody}
            setShowFullBody={setShowFullBody}
          />
          <PostActions
            upvoteCount={post.UpvoteCount ?? 0}
            hasUpvoted={post.HasUpvoted ?? false}
            handleUpvote={handleUpvote}
            commentCount={post.CommentCount ?? 0}
            isAdminOrModerator={
              user?.role === "admin" || user?.role === "moderator"
            }
          />
          {/* Replace the comments section in PostDetail with this code */}
          <Box sx={{ mt: 3 }}>
            {comments?.map((comment) => (
              <CommentItem
                postID={post.PostID}
                key={comment.id}
                comment={comment}
                handleReplyClick={handleReplyClick}
                handleEditComment={handleEditComment}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
            {user && user.role !== "admin" && user.role !== "moderator" && (
              <CommentForm
                newComment={newComment}
                setNewComment={setNewComment}
                handleAddComment={handleAddComment}
                replyingToUsername={replyingToUsername}
                setReplyCommentId={setReplyCommentId}
                setReplyingToUsername={setReplyingToUsername}
              />
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default withRole(PostDetail, [
  "admin",
  "moderator",
  "user",
  "contributor",
]);
