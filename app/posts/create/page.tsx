"use client";
import BlogEditor from "@/components/BlogEditor";
import { useState } from "react";

type Props = {};

const CreatePost = (props: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  return (
    <BlogEditor
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      selectedTags={[]}
      setSelectedTags={() => {}}
      tags={[]}
      onSave={() => {}}
    />
  );
};

export default CreatePost;
