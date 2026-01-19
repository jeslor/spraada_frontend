"use client";

import {
  ProfileSummary,
  useMessageActions,
  useProfiles,
  useSelectedUserToMessage,
} from "@/store";
import EachSideUser from "./EachSideUser";

const ChatLeft = ({
  onSelectUser,
}: {
  onSelectUser: (user: ProfileSummary) => void;
}) => {
  const profiles = useProfiles();
  const selectedUserToMessage = useSelectedUserToMessage();
  const { getLastMessage } = useMessageActions();

  return (
    <div>
      {profiles.map((profile) => (
        <EachSideUser
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
