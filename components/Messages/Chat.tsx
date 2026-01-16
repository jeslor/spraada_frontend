"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket/socket";
import {
  Message,
  useFetchMessages,
  useMessages,
  useProfile,
  useUpdateMessages,
} from "@/store";
import CropImage from "@/components/Onboarding/CropImage";
import { useMessageActions, ProfileSummary } from "@/store";
import ChatForm from "./ChatForm";
import MessageBubble from "./MessageBubble";

export default function Chat({
  selectedUser,
}: {
  selectedUser: ProfileSummary;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasFetchedMessages, setHasFetchedMessages] = useState(false);
  const [profileId, setProfileId] = useState<number | undefined>(undefined);
  const [sendingImage, setSendingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCrop, setShowCrop] = useState(false);

  const fetchMessages = useFetchMessages();
  const messages = useMessages();
  const updateMessages = useUpdateMessages();
  const profile = useProfile();

  const [input, setInput] = useState("");

  //set the current User profileId
  useEffect(() => {
    if (profile?.id) {
      setProfileId(profile.id);
    }
  }, [profile?.id]);

  // Fetch messages on profileId change
  useEffect(() => {
    if (profile?.id && !hasFetchedMessages) {
      fetchMessages(profile.id);
      setHasFetchedMessages(true);
    }
  }, [profile?.id, hasFetchedMessages, fetchMessages]);

  //set current messages when selectedUserId or messages change
  useEffect(() => {
    if (selectedUser?.id !== null && hasFetchedMessages) {
      const { selectedUserMessages } = useMessageActions();
      const userMessages = selectedUserMessages(selectedUser?.id!);
      setCurrentMessages(userMessages);
    }
  }, [selectedUser?.id, hasFetchedMessages, useMessageActions, messages]);

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
  const sendMessage = async (e: React.FormEvent) => {
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
      senderId: Number(profileId),
      receiverId: Number(selectedUser.id),
      sender: {
        id: profileId!,
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        avatarUrl: profile?.avatarUrl,
      },
      receiver: {
        id: selectedUser.id,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        avatarUrl: selectedUser.avatarUrl,
      },
      content: input,
      mediaFiles: mediaUrl ? [{ mediaUrl }] : [],
      createdAt: new Date().toISOString(),
    };
    updateMessages(newMsg);
    const socket = getSocket(profileId!);
    socket.emit("chats", { userId: selectedUser.id, content: input, mediaUrl });
    setInput("");
  };

  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

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

  return (
    <div className="flex flex-col flex-1 h-full w-full min-w-0 min-h-0 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 scrollbar-hide">
        <div className="flex flex-col gap-4 scrollbar-hide ">
          {currentMessages.map((msg, idx) => (
            <MessageBubble
              key={msg.id || idx}
              msg={msg}
              profileId={profileId}
              idx={idx}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Chat Form */}
      <ChatForm
        sendMessage={sendMessage}
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
