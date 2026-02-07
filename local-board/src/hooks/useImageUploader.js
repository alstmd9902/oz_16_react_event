import { useState } from "react";

export function useImageUploader() {
  const MAX_IMAGES = 5;
  const [images, setImages] = useState([]);

  const addImages = (files) => {
    if (images.length + files.length > MAX_IMAGES) {
      alert("이미지는 최대 5장까지 첨부할 수 있습니다.");
      return;
    }

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...mapped]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.file) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetImages = () => {
    images.forEach((img) => {
      if (img.file) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImages([]);
  };

  return {
    images,
    setImages,
    addImages,
    removeImage,
    resetImages,
    MAX_IMAGES
  };
}
