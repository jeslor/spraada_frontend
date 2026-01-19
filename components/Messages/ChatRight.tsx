"use client";

import { useEffect, useRef, useState } from "react";
import {
  Message,
  ProfileSummary,
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

export default function ChatRight() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  useState(false);
  const [sendingImage, setSendingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [input, setInput] = useState("");

  const sendMessage = useSendMessage();
  const Messages = useMessages();
  const selectedUserToMessage = useSelectedUserToMessage();
  const selectedUserMessages = useSelectedUserMessages();
  const setSelectedUserMessages = useSetSelectedUserMessages();
  const profile = useProfile();

  useEffect(() => {
    setHasMounted(false);
  }, []);

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

  //   ==========================Actions==========================
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setShowCrop(true);
    }
  };

  // Handle cropped image save
  const handleCropSave = (previewUrl: string, file: File) => {
    setImagePreview(previewUrl);
    setImageFile(file);
    setShowCrop(false);
  };

  // Send message (text or image)
  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;
    let mediaUrl = null;
    if (imageFile) {
      setSendingImage(true);
      // For demo: just use preview, in real app upload to server/cloud
      mediaUrl = imagePreview;
      setSendingImage(false);
      setImageFile(null);
      setImagePreview(null);
    }
    const newMsg = {
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
      mediaFiles: mediaUrl ? [{ mediaUrl }] : [],
      createdAt: new Date().toISOString(),
    };
    setHasMounted(true);
    sendMessage(newMsg, Number(profile?.id));
    setInput("");
  };

  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full min-w-0 min-h-0 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 scrollbar-hide">
        {!selectedUserToMessage ? (
          <EmptyChat />
        ) : (
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-4 scrollbar-hide "
          >
            {selectedUserMessages.map((msg: Message, idx: number) => (
              <MessageBubble
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
        sendMessage={submitMessage}
        input={input}
        setInput={setInput}
        handleImageChange={handleImageChange}
        sendingImage={sendingImage}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiClick={handleEmojiClick}
      />

      {/* Emoji Icon */}

      {/* Crop Image Modal */}
      {showCrop && imageFile && (
        <CropImage
          file={imageFile}
          fileName={imageFile.name.split(".")[0]}
          onCancel={() => setShowCrop(false)}
          onSave={handleCropSave}
          aspectRatio={1}
        />
      )}
    </div>
  );
}
