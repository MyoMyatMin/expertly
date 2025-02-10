"use client";
import BlogEditor from "@/components/BlogEditor";
import { api } from "@/helper/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {};

const CreatePost = (props: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
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

export default CreatePost;
