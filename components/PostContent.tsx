import React from "react";
import ReactMarkdown from "react-markdown";
import { Box, Button } from "@mui/material";

interface PostContentProps {
  content: string;
  showFullBody: boolean;
  setShowFullBody: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostContent: React.FC<PostContentProps> = ({
  content,
  showFullBody,
  setShowFullBody,
}) => (
  <Box sx={{ mb: 2 }}>
    {showFullBody ? (
      <ReactMarkdown>{content}</ReactMarkdown>
    ) : (
      <ReactMarkdown>{`${content.substring(0, 300)}...`}</ReactMarkdown>
    )}
    {content.length > 300 && (
      <Button size="small" onClick={() => setShowFullBody((prev) => !prev)}>
        {showFullBody ? "Read Less" : "Read More"}
      </Button>
    )}
  </Box>
);
export default PostContent;
