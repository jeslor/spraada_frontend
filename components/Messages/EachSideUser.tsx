"use client";
import { useMessages } from "@/store";
import React, { useEffect } from "react";

interface EachSideUserProps {
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  selectedUser: {
    id: number;
  } | null;
  onSelectUser: (user: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  }) => void;
  getLastMessage: (userId: number) => string;
}

const EachSideUser = ({
  profile,
  selectedUser,
  onSelectUser,
  getLastMessage,
}: EachSideUserProps) => {
  const messages = useMessages();

  const [lastMessage, setLastMessage] = React.useState<string>("");

  useEffect(() => {
    const message = getLastMessage(profile.id);
    setLastMessage(message);
  }, [getLastMessage, profile.id, messages]);

  return (
    <div
      onClick={() => onSelectUser(profile)}
      key={profile.id}
      className={`p-2  cursor-pointer hover:bg-primary/10  ${
        selectedUser?.id === profile.id ? "bg-primary/10" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={profile.avatarUrl || "/default-avatar.png"}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <p className="m-0 p-0 font-semibold text-[12px]">{`${profile.firstName} ${profile.lastName}`}</p>
          <p className="m-0 p-0 text-[11px] text-gray-500 font-medium truncate max-w-[180px]">
            {getLastMessage(profile.id)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EachSideUser;
