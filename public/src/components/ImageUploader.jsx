import React, { useState } from "react";
import "../components/ImageUploader.css";
import toast from "react-hot-toast";

const ImageUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      toast.success(`File uploaded successfully: ${data.fileName}`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    }
  };

  return (
    <div className="image">
      <input type="file" onChange={handleFileChange} />
      <button to="/signup" onClick={handleUpload} >
        Upload to Google Drive
      </button>
    </div>
  );
};

export default ImageUploader;
