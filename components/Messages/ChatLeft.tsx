"use client";

import {
  ProfileSummary,
  useMessageActions,
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
  const selectedUserToMessage = useSelectedUserToMessage();
  const { counters } = useUnreadMessagesCount();
  const { getLastMessage } = useMessageActions();

  console.log(counters);

  return (
    <div>
      {profiles.map((profile) => (
        <ChatLeftUser
          unreadCount={counters[profile.id] || 0}
          key={profile.id}
          profile={profile}
          selectedUser={selectedUserToMessage}
          onSelectUser={onSelectUser}
          getLastMessage={getLastMessage}
        />
      ))}
    </div>
  );
};

export default ChatLeft;
