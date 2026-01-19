import React, { useEffect } from "react";

import {
  ProfileSummary,
  useSetSelectedUserToMessage,
  useUpdateProfiles,
} from "@/store";
import { useSearchParams } from "next/navigation";
import ChatLeft from "./ChatLeft";
import ChatRight from "./ChatRight";

const Chat = () => {
  const searchParams = useSearchParams();

  const updateProfiles = useUpdateProfiles();
  const setSelectedUserToMessage = useSetSelectedUserToMessage();

  /* Handle URL params & localStorage */
  useEffect(() => {
    const userId = searchParams.get("userId");
    const firstName = searchParams.get("firstName") || "";
    const lastName = searchParams.get("lastName") || "";
    const avatarUrl = searchParams.get("avatarUrl") || undefined;

    if (userId && firstName && lastName) {
      const newUser: ProfileSummary = {
        id: Number(userId),
        firstName,
        lastName,
        avatarUrl,
      };

      setSelectedUserToMessage(newUser);
      localStorage.setItem("spraadaSelectedChatUserId", newUser.id.toString());
      updateProfiles(newUser);
      return;
    }

    const storedId =
      typeof window !== "undefined"
        ? localStorage.getItem("spraadaSelectedChatUserId")
        : null;

    if (storedId) {
      setSelectedUserToMessage({
        id: Number(storedId),
        firstName: "",
        lastName: "",
      });
    }
  }, [searchParams, setSelectedUserToMessage]);

  const handleSelectedUser = (user: ProfileSummary) => {
    setSelectedUserToMessage(user);
    localStorage.setItem("spraadaSelectedChatUserId", user.id.toString());
  };

  return (
    <div className="flex h-dvh min-h-0 fixed w-[calc(100vw-79px)] xl:w-[calc(100vw-250px)]">
      <div className="bg-primary-50 w-[80vw] max-w-[300px] min-w-[220px] h-full border-r border-gray-200">
        <ChatLeft onSelectUser={handleSelectedUser} />
      </div>

      <div className="flex-1 flex flex-col h-full min-h-0 p-0 m-0">
        <ChatRight />
      </div>
    </div>
  );
};

export default Chat;
