"use client";
import Chat from "@/components/Messages/Chat";
import { useChatSocket } from "@/Hooks/InitializeMessageSocket";
import SideUsers from "@/components/Messages/SideUsers";
import {
  ProfileSummary,
  useFetchMessages,
  useProfile,
  useUpdateProfiles,
} from "@/store";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  const [hasFetchedMessages, setHasFetchedMessages] = useState(false);
  const [profileId, setProfileId] = useState<number | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<ProfileSummary | null>(null);

  const fetchMessages = useFetchMessages();
  const updateProfiles = useUpdateProfiles();
  const profile = useProfile();

  //initialize chat socket
  useChatSocket(profileId!);

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
      setSelectedUser(newUser);
      updateProfiles(newUser);
      localStorage.setItem("spraadaSelectedChatUserId", newUser.id.toString());

      return;
    } else {
      const storedUserId = localStorage.getItem("spraadaSelectedChatUserId");
      if (storedUserId) {
        setSelectedUser({ id: Number(storedUserId) } as ProfileSummary);
      }
    }
  }, []);

  const handleSelectedUser = (user: ProfileSummary) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    if (selectedUser) {
      //update the url to include the selected user id
      window.history.replaceState(null, "", `/messages/${selectedUser.id}`);
      //store the selected user id in local storage
      localStorage.setItem(
        "spraadaSelectedChatUserId",
        selectedUser.id.toString()
      );
    }
  }, [selectedUser]);

  return (
    <div className="flex h-dvh min-h-0 fixed w-[calc(100vw-79px)] xl:w-[calc(100vw-250px)] ">
      <div className="bg-primary-50 w-[80vw] max-w-[300px] min-w-[220px] h-full border-r border-gray-200">
        <SideUsers
          selectedUser={selectedUser}
          onSelectUser={handleSelectedUser}
        />
      </div>
      <div className="flex-1 flex flex-col h-full min-h-0 p-0 m-0">
        {profileId && (
          <Chat
            selectedUser={selectedUser!}
            profileId={profileId!}
            hasFetchedMessages={hasFetchedMessages}
          />
        )}
      </div>
    </div>
  );
}
