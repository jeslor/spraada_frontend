"use client";

import {
  ProfileSummary,
  useLoadingProfiles,
  useProfiles,
  useSelectedUserToMessage,
  useUnreadMessagesCount,
} from "@/store";
import ChatLeftUser from "./ChatLeftUser";

const ChatLeft = ({
  onSelectUser,
}: {
  onSelectUser: (user: ProfileSummary) => void;
}) => {
  const profiles = useProfiles();
  const loadingProfiles = useLoadingProfiles();
  const selectedUserToMessage = useSelectedUserToMessage();
  const unreadMessagesCounters = useUnreadMessagesCount();

  return loadingProfiles ? (
    <div className="p-4 text-center text-gray-500">Loading...</div>
  ) : (
    <div>
      {profiles.map((profile) => (
        <ChatLeftUser
          unreadMessagesCounters={unreadMessagesCounters}
          unreadCount={unreadMessagesCounters.counters[profile.id] || 0}
          key={profile.id}
          profile={profile}
          selectedUser={selectedUserToMessage}
          onSelectUser={onSelectUser}
        />
      ))}
    </div>
  );
};

export default ChatLeft;
