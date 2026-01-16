"use client";
import Chat from "@/components/Messages/Chat";
import SideUsers from "@/components/Messages/SideUsers";
import { ProfileSummary } from "@/store";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState<ProfileSummary | null>(null);

  useEffect(() => {
    //check if there is a selected user id in local storage
    const storedUserId = localStorage.getItem("spraadaSelectedChatUserId");
    if (storedUserId) {
      setSelectedUser({ id: parseInt(storedUserId, 10) } as ProfileSummary);
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
        {selectedUser && <Chat selectedUser={selectedUser} />}
      </div>
    </div>
  );
}
