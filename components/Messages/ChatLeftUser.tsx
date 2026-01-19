"use client";

import { useMessageActions } from "@/store";

interface EachSideUserProps {
  unreadCount: number;
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
}

const ChatLeftUser = ({
  unreadCount,
  profile,
  selectedUser,
  onSelectUser,
}: EachSideUserProps) => {
  const { getLastMessage } = useMessageActions();
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
          <p
            className={`m-0 p-0 text-[11px] text-gray-500 font-medium truncate max-w-[180px] ${
              unreadCount > 0 ? "font-bold text-gray-800" : ""
            }`}
          >
            {getLastMessage(profile.id)}
          </p>
        </div>
        <div className="ml-auto">
          {unreadCount > 0 && (
            <div className="bg-primary-800/80 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLeftUser;
