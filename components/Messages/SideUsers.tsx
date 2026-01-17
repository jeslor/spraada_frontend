"use client";

import React, { useEffect, useState } from "react";
import {
  ProfileSummary,
  useMessageActions,
  useMessages,
  useProfile,
  useProfiles,
} from "@/store";
import EachSideUser from "./EachSideUser";

const SideUsers = ({
  selectedUser,
  onSelectUser,
  hasFetchedProfiles,
}: {
  selectedUser: ProfileSummary | null;
  onSelectUser: (user: ProfileSummary) => void;
  hasFetchedProfiles: boolean;
}) => {
  const [currentUserProfiles, setCurrentUserProfiles] = useState<
    ProfileSummary[]
  >([]);

  const profiles = useProfiles();
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
          selectedUser={selectedUser}
          onSelectUser={onSelectUser}
          getLastMessage={getLastMessage}
        />
      ))}
    </div>
  );
};

export default SideUsers;
