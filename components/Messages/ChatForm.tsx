"use client";
import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { SpraadaButton } from "../ui/SpraadaButton";
import {
  Message,
  useProfile,
  useSendMessage,
  useSelectedUserToMessage,
} from "@/store";
import EmojiPicker from "emoji-picker-react";
import CropImage from "@/components/Onboarding/CropImage";

interface ChatFormProps {
  setIsOnlyEdited: React.Dispatch<React.SetStateAction<boolean>>;
  setHasMounted: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_IMAGE_PREVIEWS = 3;

const ChatForm = ({ setIsOnlyEdited, setHasMounted }: ChatFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [pickedImageFile, setPickedImageFile] = useState<File | null>(null);
  const [imageLimitReached, setImageLimitReached] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showCrop, setShowCrop] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  useState(false);
  const [sendingImage, setSendingImage] = useState(false);

  const sendMessage = useSendMessage();
  const selectedUserToMessage = useSelectedUserToMessage();
  const profile = useProfile();

  useEffect(() => {
    if (textareaRef.current) {
      // Only grow if there are multiple lines (i.e., user pressed Shift+Enter)
      const lines = input.split("\n").length;
      if (lines > 1) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      } else {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [input]);

  // Check image limit reached
  useEffect(() => {
    if (imagePreviews.length >= MAX_IMAGE_PREVIEWS) {
      setImageLimitReached(true);
    } else {
      setImageLimitReached(false);
    }
  }, [imagePreviews]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        !target.closest("#emoji-picker") &&
        !target.closest("button[title='Add emoji']")
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showEmojiPicker === true]);

  //   ==========================Actions==========================

  // Only grow textarea when Shift+Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // Trigger sendMessage here if you want Enter to send
      submitMessage(e as unknown as React.FormEvent<HTMLTextAreaElement>);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreviews.length >= MAX_IMAGE_PREVIEWS) {
      setShowCrop(false);
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      setPickedImageFile(file);
      setShowCrop(true);
    }
  };

  // Handle cropped image save
  const handleCropSave = (previewUrl: string, file: File) => {
    setImagePreviews([...imagePreviews!, previewUrl]);
    setImageFiles([...imageFiles!, file]);
    setShowCrop(false);
  };

  // Send message (text or image)
  const submitMessage = async (e: React.FormEvent) => {
    setIsOnlyEdited(false);
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: Message = {
      id: new Date().toISOString(),
      senderId: Number(profile?.id),
      receiverId: Number(selectedUserToMessage?.id),
      sender: {
        id: profile?.id!,
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        avatarUrl: profile?.avatarUrl,
      },
      receiver: {
        id: Number(selectedUserToMessage?.id),
        firstName: selectedUserToMessage?.firstName!,
        lastName: selectedUserToMessage?.lastName!,
        avatarUrl: selectedUserToMessage?.avatarUrl,
      },
      content: input,
      mediaFiles: imagePreviews.length
        ? imagePreviews.map((url) => ({ mediaUrl: url, mediaUrlKey: "" }))
        : [],
      blobFiles: imageFiles.length ? imageFiles : [],
      createdAt: new Date().toISOString(),
    };
    setHasMounted(true);
    sendMessage(newMsg, Number(profile?.id));
    setInput("");
    setImagePreviews([]);
    setImageFiles([]);
  };

  //load the emoji into the input field
  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  //handle removing an image preview
  const handleRemoveImagePreview = (index: number) => {
    const newPreviews = [...imagePreviews!];
    const newFiles = [...imageFiles];
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
    setImageLimitReached(false);
  };

  return (
    <div className="relative z-46">
      {imagePreviews &&
        imagePreviews.length > 0 &&
        imagePreviews.map((previewUrl, index) => (
          <div
            style={{
              marginLeft: `${index * 110}px`,
            }}
            key={index}
            className={`absolute bottom-20 left-4 z-10 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 size-[100px] px] mr-2`}
          >
            <button className="absolute top-0 right-0 z-20 bg-red-800 rounded-full p-0.5 flex items-center justify-center text-white text-[12px] cursor-pointer">
              <Icon
                icon="ic:round-close"
                className=""
                onClick={() => handleRemoveImagePreview(index)}
              />
            </button>
            <img
              src={previewUrl}
              alt={`Preview ${index + 1}`}
              className="w-32 h-32 object-cover"
            />
          </div>
        ))}
      {/* Image limit reached notification */}
      {imageLimitReached && (
        <div className="bottom-12  left-4 z-20 p-2  text-red-600 font-medium text-[10px] absolute">
          You can only upload up to 3 images.
        </div>
      )}
      <form
        onSubmit={submitMessage}
        className="flex items-center gap-3 px-4 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 relative"
      >
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Attach image"
          onClick={
            imageLimitReached
              ? undefined
              : () => document.getElementById("chat-image-upload")?.click()
          }
        >
          <Icon
            icon="solar:gallery-add-bold"
            width={24}
            className="text-primary-600 dark:text-primary-400"
          />
        </button>
        <input
          id="chat-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <textarea
          ref={textareaRef}
          rows={1}
          className="flex-1 resize-none rounded-2xl px-4 py-2 bg-gray-100 dark:bg-gray-800 
             text-gray-900 dark:text-white focus:outline-none 
             focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 
             transition text-[14px] overflow-y-auto max-h-32"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sendingImage}
        />
        <div className="flex items-center justify-center">
          <SpraadaButton
            type="submit"
            className="bg-transparent text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 p-1 rounded-full transition"
            disabled={sendingImage}
          >
            <Icon icon="lsicon:send-filled" width={22} />
          </SpraadaButton>
          <div
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-[23px] text-primary-600"
            title="Add emoji"
            onClick={() => setShowEmojiPicker((v) => !v)}
          >
            <Icon icon="line-md:emoji-grin" />
          </div>
        </div>

        {showEmojiPicker && (
          <div id="emoji-picker" className="absolute bottom-16 right-0 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </form>
      {/* Crop Image Modal */}
      {showCrop && pickedImageFile && (
        <CropImage
          file={pickedImageFile}
          fileName={pickedImageFile.name.split(".")[0]}
          onCancel={() => setShowCrop(false)}
          onSave={handleCropSave}
          aspectRatio={1}
        />
      )}
    </div>
  );
};

export default ChatForm;
