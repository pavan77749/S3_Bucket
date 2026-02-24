"use client";

import React, { useState } from "react";

export default function CreateProductForm() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type");
      return;
    }

    try {
      setUploadingImage(true);

      // STEP 1 → Get Presigned URL
      const presignRes = await fetch(
        "http://localhost:5000/api/get-presigned-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mime: file.type,
          }),
        },
      );

      const { url, filename } = await presignRes.json();

      // STEP 2 → Upload to S3 immediately
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      console.log("✅ Image uploaded to S3");

      // Save image filename in state
      setUploadedImageName(filename);
    } catch (err) {
      console.error("❌ Upload Error:", err);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedImageName) {
      alert("Image still uploading or not selected");
      return;
    }

    try {
      setLoading(true);

      const productRes = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          description,
          price,
          imageName: uploadedImageName,
        }),
      });

      if (!productRes.ok) {
        throw new Error("Failed to save product");
      }

      alert("Product saved successfully");
    } catch (err) {
      console.error(err);
      alert("DB Save Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-5"
      >
        <input
          type="text"
          placeholder="Product Name"
          required
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-500 text-black rounded-lg"
        />

        <textarea
          rows="4"
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-500 text-black rounded-lg"
        />

        <input
          type="file"
          required
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="w-full px-4 py-2 border border-gray-500 text-black rounded-lg"
          onChange={handleImageChange}
        />

        <input
          type="number"
          required
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border border-gray-500 text-black rounded-lg"
        />

        <button
          disabled={loading || uploadingImage}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg"
        >
          {uploadingImage
            ? "Uploading Image..."
            : loading
              ? "Saving..."
              : "Create Product"}
        </button>
      </form>
    </div>
  );
}
