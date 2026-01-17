"use client";

import React, { useEffect, useState } from "react";
import {
  ProfileSummary,
  useMessageActions,
  useProfiles,
  useSelectedUserToMessage,
} from "@/store";
import EachSideUser from "./EachSideUser";

const SideUsers = ({
  onSelectUser,
  hasFetchedProfiles,
}: {
  onSelectUser: (user: ProfileSummary) => void;
  hasFetchedProfiles: boolean;
}) => {
  const [currentUserProfiles, setCurrentUserProfiles] = useState<
    ProfileSummary[]
  >([]);

  const profiles = useProfiles();
  const selectedUserToMessage = useSelectedUserToMessage();
  const { getLastMessage } = useMessageActions();

  //set current user chat profiles when they are fetched
  useEffect(() => {
    if (hasFetchedProfiles) {
      setCurrentUserProfiles(profiles);
    }
  }, [hasFetchedProfiles, profiles.length]);

  return (
    <div>
      {currentUserProfiles.map((profile) => (
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

export default SideUsers;
