"use client";
import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import Post from "@/components/PostBox";
import ReportModal from "@/components/ReportModal";

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

  const posts = [
    {
      id: "1",
      title: "Exploring Markdown in React",
      content: `
This is an example of **Markdown** content displayed in a React application. 
And here are some reasons why Markdown is great:

- Supports headings, lists, and more.
- Easy to use with libraries like [react-markdown](https://github.com/remarkjs/react-markdown).

\`\`\`javascript
// Example code block
console.log("Hello, Markdown!");
\`\`\`

Try adding more Markdown features to this post!

![React Logo](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)
`,
      author: "John Doe",
      date: "2024-11-25",
    },
    {
      id: "2",
      title: "Another Markdown Post",
      content: `

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. 

1. Simple and readable.
2. Compatible with many platforms.
3. Supports images, like this:

![React Logo](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)

> Markdown makes content **elegant**!
`,
      author: "Jane Smith",
      date: "2024-11-26",
    },
  ];

  const followingPosts = [
    {
      id: "3",
      title: "Following Post 1",
      content: "This is the third post content.",
      author: "John Doe",
      date: "2024-11-27",
    },
    {
      id: "4",
      title: "Following Post 2",
      content: "Another exciting post to read.",
      author: "Jane Smith",
      date: "2024-11-28",
    },
  ];

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
            post={{
              ...post,
              content: removeImagesFromMarkdown(post.content),
            }}
            onLike={handleLike}
            onReport={(id: React.SetStateAction<string | null>) =>
              setReportPostId(id)
            }
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
