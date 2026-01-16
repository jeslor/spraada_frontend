"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket/socket";
import { Message, useFetchMessages, useMessages } from "@/store";
import CropImage from "@/components/Onboarding/CropImage";
import { Icon } from "@iconify/react";
import EmojiPicker from "emoji-picker-react";
import { SpraadaButton } from "../ui/SpraadaButton";

export default function Chat({ profileId }: { profileId?: number }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasFetchedMessages, setHasFetchedMessages] = useState(false);
  const [sendingImage, setSendingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCrop, setShowCrop] = useState(false);

  const fetchMessages = useFetchMessages();
  const messages = useMessages();
  const [input, setInput] = useState("");
  const otherId = profileId === 1 ? 2 : 1;
  const socket = getSocket(profileId!);

  // Fetch messages on profileId change
  useEffect(() => {
    if (profileId && !hasFetchedMessages) {
      fetchMessages(profileId);
      setHasFetchedMessages(true);
    }
  }, [profileId, hasFetchedMessages, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    socket.emit("chats", { userId: otherId, text: input, mediaUrl });
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

  // allo textarea to grow with content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col flex-1 h-full w-full min-w-0 min-h-0 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 scrollbar-hide">
        <div className="flex flex-col gap-4 scrollbar-hide ">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${
                msg.senderId === profileId ? "justify-end" : "justify-start"
              }`}
            >
              <pre
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm font-medium wrap-break-word ${
                  msg.senderId === profileId
                    ? "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100 rounded-br-md"
                    : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
                }`}
              >
                {msg.content}
                {msg.mediaFiles && msg.mediaFiles.length > 0 && (
                  <div className="mt-2">
                    {msg.mediaFiles.map((media, i) => (
                      <img
                        key={i}
                        src={media.mediaUrl}
                        alt="attachment"
                        className="rounded-lg max-h-48 border mt-1"
                      />
                    ))}
                  </div>
                )}
                <div className="text-[10px] text-right text-gray-400 mt-1">
                  {msg.createdAt &&
                    new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
              </pre>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 px-4 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 relative"
      >
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Attach image"
          onClick={() => document.getElementById("chat-image-upload")?.click()}
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
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Add emoji"
            onClick={() => setShowEmojiPicker((v) => !v)}
          >
            <Icon icon="emojione:boy-medium-dark-skin-tone" width={24} />
          </div>
        </div>

        {showEmojiPicker && (
          <div id="emoji-picker" className="absolute bottom-16 right-0 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </form>
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
