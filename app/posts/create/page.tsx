"use client";
import { WithContributor } from "@/app/hocs/withAuth";
import BlogEditor from "@/components/BlogEditor";
import { api } from "@/helper/axiosInstance";
import { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    try {
      const response = await api.protected.createPost({
        title,
        content,
        images,
      });

      console.log("Post saved successfully:", response.data);
      alert("Post saved successfully!");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("An error occurred while saving the post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BlogEditor
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      onSave={onSave}
      onImageUpload={setImages}
    />
  );
};

export default WithContributor(CreatePost);
