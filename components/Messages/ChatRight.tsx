"use client";

import { useEffect, useRef, useState } from "react";
import {
  Message,
  useDeleteMessage,
  useMessages,
  useProfile,
  useSelectedUserMessages,
  useSelectedUserToMessage,
  useSendMessage,
  useSetSelectedUserMessages,
} from "@/store";
import CropImage from "@/components/Onboarding/CropImage";
import ChatForm from "./ChatForm";
import MessageBubble from "./MessageBubble";
import EmptyChat from "./EmptyChat";

const MAX_IMAGE_PREVIEWS = 3;
export default function ChatRight() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const mainMessageContainerRef = useRef<HTMLDivElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  useState(false);
  const [sendingImage, setSendingImage] = useState(false);
  const [chatHeightLocked, setChatHeightLocked] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [pickedImageFile, setPickedImageFile] = useState<File | null>(null);
  const [imageLimitReached, setImageLimitReached] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showCrop, setShowCrop] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [input, setInput] = useState("");

  const sendMessage = useSendMessage();
  const Messages = useMessages();
  const selectedUserToMessage = useSelectedUserToMessage();
  const selectedUserMessages = useSelectedUserMessages();
  const setSelectedUserMessages = useSetSelectedUserMessages();
  const deleteMessage = useDeleteMessage();
  const profile = useProfile();

  useEffect(() => {
    setHasMounted(false);
  }, []);

  //prevent scroll when action menu is open
  useEffect(() => {
    const container = mainMessageContainerRef.current;
    if (container) {
      if (chatHeightLocked) {
        container.style.overflowY = "hidden";
      } else {
        container.style.overflowY = "auto";
      }
    }
    return () => {
      if (container) {
        container.style.overflowY = "auto";
      }
    };
  }, [chatHeightLocked]);

  //   ==========================Effects==========================
  // Scroll to bottom logic
  useEffect(() => {
    // Only scroll if content is taller than container
    const container = messagesContainerRef.current;
    if (container) {
      if (hasMounted) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        messagesEndRef.current?.scrollIntoView();
      }
    }
  }, [selectedUserMessages]); // Only when messages change

  // Set messages for selected user
  useEffect(() => {
    if (selectedUserToMessage) {
      setSelectedUserMessages(selectedUserToMessage.id);
    }
  }, [selectedUserToMessage, Messages]);

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

  // Check image limit reached
  useEffect(() => {
    if (imagePreviews.length >= MAX_IMAGE_PREVIEWS) {
      setImageLimitReached(true);
    } else {
      setImageLimitReached(false);
    }
  }, [imagePreviews]);

  //   ==========================Actions==========================
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

  // Send message (text or image)
  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageFiles.length) return;
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

  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    console.log(messageId);

    deleteMessage(messageId);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full min-w-0 min-h-0 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Messages */}
      <div
        ref={mainMessageContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-6 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 scrollbar-hide"
      >
        {!selectedUserToMessage ? (
          <EmptyChat />
        ) : (
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-4 scrollbar-hide "
          >
            {selectedUserMessages.map((msg: Message, idx: number) => (
              <MessageBubble
                handleDeleteMessage={handleDeleteMessage}
                setChatHeightLocked={setChatHeightLocked}
                key={msg.id || idx}
                msg={msg}
                profileId={profile?.id!}
                idx={idx}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* Chat Form */}
      <ChatForm
        imagePreviews={imagePreviews}
        sendMessage={submitMessage}
        input={input}
        setInput={setInput}
        imageLimitReached={imageLimitReached}
        handleRemoveImagePreview={handleRemoveImagePreview}
        handleImageChange={handleImageChange}
        sendingImage={sendingImage}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiClick={handleEmojiClick}
      />

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
}
