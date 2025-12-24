"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import CropImage from "@/components/Onboarding/CropImage";
import customFetch from "@/lib/customFetch";
import { useRouter } from "next/navigation";

interface ProfileAvatarProps {
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  profileId: number;
}

export default function ProfileAvatar({
  avatarUrl,
  firstName,
  lastName,
  profileId,
}: ProfileAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(avatarUrl || "");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleCropSave = async (url: string, file: File) => {
    setSelectedFile(null);
    setIsLoading(true);
    setError("");

    try {
      // 1. Upload Image to S3
      const formData = new FormData();
      formData.append("images", file);

      const uploadRes = await customFetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
        }/upload/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error(
          uploadRes.data?.message ||
            uploadRes.error ||
            "Failed to upload profile image"
        );
      }

      const uploadedImage = uploadRes.data[0];

      // 2. Update Profile with new avatar URL
      const updateRes = await customFetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
        }/profile/${profileId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            avatarUrl: uploadedImage.url,
            avatarUrlKey: uploadedImage.key,
          }),
        }
      );

      if (!updateRes.ok) {
        throw new Error(
          updateRes.data?.message ||
            updateRes.error ||
            "Failed to update profile picture"
        );
      }

      // Update local preview
      setPreviewUrl(uploadedImage.url);

      // Refresh the page to show updated data
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      console.error("Error updating profile picture:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCropCancel = () => {
    setSelectedFile(null);
  };

  return (
    <>
      {/* Crop Image Modal */}
      {selectedFile && (
        <CropImage
          fileName={selectedFile.name}
          maxOutputSize={800}
          file={selectedFile}
          onCancel={handleCropCancel}
          onSave={handleCropSave}
          aspectRatio={1}
        />
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/heic"
        onChange={handleFileSelect}
      />

      {/* Avatar Container */}
      <div className="relative z-10">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-xl relative ring-4 ring-white">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Icon
                icon="solar:restart-bold"
                className="w-8 h-8 animate-spin text-primary-600"
              />
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt={firstName || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary-100 to-primary-200 text-primary-600 text-4xl md:text-5xl font-bold">
              {firstName?.[0]}
              {lastName?.[0]}
            </div>
          )}
        </div>

        {/* Online Status Indicator */}
        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-sm" />

        {/* Edit Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="absolute bottom-0 right-0 p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Edit profile picture"
        >
          <Icon icon="solar:camera-bold" className="text-lg" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </>
  );
}
