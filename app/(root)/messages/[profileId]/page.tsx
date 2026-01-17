"use client";
import Chat from "@/components/Messages/Chat";
import { useChatSocket } from "@/Hooks/InitializeMessageSocket";
import SideUsers from "@/components/Messages/SideUsers";
import {
  ProfileSummary,
  useFetchMessages,
  useMessageActions,
  useMessages,
  useProfile,
  useSelectedUserToMessage,
  useSetSelectedUserToMessage,
  useUpdateProfiles,
} from "@/store";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  const [hasFetchedMessages, setHasFetchedMessages] = useState(false);
  const [hasFetchedProfiles, setHasFetchedProfiles] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);

  const fetchMessages = useFetchMessages();
  const messages = useMessages();
  const updateProfiles = useUpdateProfiles();
  const setSelectedUserToMessage = useSetSelectedUserToMessage();
  const { userProfiles } = useMessageActions();
  const selectedUserToMessage = useSelectedUserToMessage();
  const profile = useProfile();
  useChatSocket(profile?.id!);

  // Fetch all messages connected to the current user profile
  useEffect(() => {
    if (profile?.id && !hasFetchedMessages) {
      fetchMessages(profile.id);
      setHasFetchedMessages(true);
    }
  }, [profile?.id, hasFetchedMessages, fetchMessages]);

  // generate user profiles from messages once messages are fetched
  useEffect(() => {
    if (hasFetchedMessages && !hasFetchedProfiles && messages.length > 0) {
      userProfiles();
      setHasFetchedProfiles(true);
    }
  }, [hasFetchedMessages, hasFetchedProfiles, messages]);

  useEffect(() => {
    //check if there is a selected user id in local storage
    if (params.profileId) {
      const firstName = searchParams.get("firstName") || "";
      const lastName = searchParams.get("lastName") || "";
      const avatarUrl = searchParams.get("avatarUrl") || undefined;
      const newUser: ProfileSummary = {
        id: Number(params.profileId),
        firstName,
        lastName,
        avatarUrl,
      };
      setSelectedUserToMessage(newUser);
      updateProfiles(newUser);
    }

    const localProfileId = localStorage.getItem("spraadaSelectedChatUserId");
    if (localProfileId) {
      setProfileId(Number(localProfileId));
    }
  }, []);

  const handleSelectedUser = (user: ProfileSummary) => {
    setSelectedUserToMessage(user);
  };

  useEffect(() => {
    if (selectedUserToMessage) {
      //update the url to include the selected user id
      window.history.replaceState(
        null,
        "",
        `/messages/${selectedUserToMessage.id}`
      );
      //store the selected user id in local storage
      localStorage.setItem(
        "spraadaSelectedChatUserId",
        selectedUserToMessage.id.toString()
      );
    }
  }, [selectedUserToMessage]);

  return (
    <div className="flex h-dvh min-h-0 fixed w-[calc(100vw-79px)] xl:w-[calc(100vw-250px)] ">
      <div className="bg-primary-50 w-[80vw] max-w-[300px] min-w-[220px] h-full border-r border-gray-200">
        <SideUsers
          selectedUser={selectedUserToMessage}
          onSelectUser={handleSelectedUser}
          hasFetchedProfiles={hasFetchedProfiles}
        />
      </div>
      <div className="flex-1 flex flex-col h-full min-h-0 p-0 m-0">
        {profileId && (
          <Chat selectedUser={selectedUserToMessage!} profileId={profileId!} />
        )}
      </div>
    </div>
  );
}
