import React, { useEffect } from "react";
import SideUsers from "./SideUsers";
import Chat from "./Chat";
import {
  ProfileSummary,
  useSelectedUserToMessage,
  useSetSelectedUserToMessage,
  useUpdateProfiles,
} from "@/store";
import { useSearchParams } from "next/navigation";

const ChatContainer = () => {
  const searchParams = useSearchParams();

  const selectedUserToMessage = useSelectedUserToMessage();
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

  /* Sync URL + localStorage when user changes */
  // useEffect(() => {
  //   if (!selectedUserToMessage) return;

  //   window.history.replaceState(
  //     null,
  //     "",
  //     `/messages/${selectedUserToMessage.id}`
  //   );

  //   localStorage.setItem(
  //     "spraadaSelectedChatUserId",
  //     selectedUserToMessage.id.toString()
  //   );
  // }, [selectedUserToMessage]);

  const handleSelectedUser = (user: ProfileSummary) => {
    setSelectedUserToMessage(user);
    localStorage.setItem("spraadaSelectedChatUserId", user.id.toString());
  };

  return (
    <div className="flex h-dvh min-h-0 fixed w-[calc(100vw-79px)] xl:w-[calc(100vw-250px)]">
      <div className="bg-primary-50 w-[80vw] max-w-[300px] min-w-[220px] h-full border-r border-gray-200">
        <SideUsers onSelectUser={handleSelectedUser} />
      </div>

      <div className="flex-1 flex flex-col h-full min-h-0 p-0 m-0">
        {selectedUserToMessage && <Chat />}
      </div>
    </div>
  );
};

export default ChatContainer;
