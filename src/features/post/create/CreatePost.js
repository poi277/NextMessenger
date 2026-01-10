// hooks/usePostForm.js
'use client';
import { useState } from 'react';

export default function usePostForm(post = null, onSubmit) {
  const isEditMode = !!post;

  const [visibility, setVisibility] = useState(post?.visibility || 'public');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(
    post?.image?.map((img) => img.url) || []
  );
  const [removeImages, setRemoveImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeNewFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl, index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    const imageKey = post.image[index].key;
    setRemoveImages((prev) => [...prev, imageKey]);
  };

  const handleSubmit = async (formData) => {
    if (!isEditMode) {
      const confirmed = window.confirm('게시물을 작성하시겠습니까?');
      if (!confirmed) return;
    }

    const newFormData = new FormData();
    
    if (isEditMode) {
      newFormData.append('postid', post._id);
      newFormData.append('removeImages', JSON.stringify(removeImages));
    }
    
    newFormData.append('title', formData.get('title'));
    newFormData.append('content', formData.get('content'));
    newFormData.append('visibility', visibility);

    selectedFiles.forEach((file) => {
      newFormData.append('files', file);
    });

    await onSubmit(newFormData);
  };

  return {
    isEditMode,
    visibility,
    setVisibility,
    selectedFiles,
    existingImages,
    removeImages,
    handleFileChange,
    removeNewFile,
    removeExistingImage,
    handleSubmit,
  };
}