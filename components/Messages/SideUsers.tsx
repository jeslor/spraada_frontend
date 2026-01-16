"use client";

import React, { useEffect } from "react";
import {
  ProfileSummary,
  useMessageActions,
  useProfile,
  useSetUserProfiles,
  useUserProfiles,
} from "@/store";
import EachSideUser from "./EachSideUser";

const SideUsers = ({
  selectedUser,
  onSelectUser,
}: {
  selectedUser: ProfileSummary | null;
  onSelectUser: (user: ProfileSummary) => void;
}) => {
  const [currentUserProfiles, setCurrentUserProfiles] = React.useState<
    ProfileSummary[]
  >([]);
  const [hasFetchedProfiles, setHasFetchedProfiles] = React.useState(false);

  const setUserProfiles = useSetUserProfiles();
  const profile = useProfile();
  const userProfiles = useUserProfiles();
  const { getLastMessage } = useMessageActions();

  // Fetch user profiles when profileId changes
  useEffect(() => {
    if (profile?.id && !hasFetchedProfiles) {
      setUserProfiles(profile.id);
      setHasFetchedProfiles(true);
    }
  }, [profile?.id, setUserProfiles, hasFetchedProfiles]);
  //set current user profiles when they are fetched
  useEffect(() => {
    if (hasFetchedProfiles) {
      setCurrentUserProfiles(userProfiles);
    }
  }, [hasFetchedProfiles, userProfiles]);

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
