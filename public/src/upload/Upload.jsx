import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageUploader from "../components/ImageUploader.jsx";

function Upload() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-[25rem]">
        <ImageUploader />
      </div>
      <Footer />
    </>
  );
}

export default Upload;
