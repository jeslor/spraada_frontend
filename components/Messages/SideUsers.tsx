"use client";

import React, { useEffect } from "react";
import {
  ProfileSummary,
  useFetchMessages,
  useSetUserProfiles,
  useUser,
  useUserProfiles,
} from "@/store";

const SideUsers = ({ profileId }: { profileId?: number }) => {
  const [currentUserProfiles, setCurrentUserProfiles] = React.useState<
    ProfileSummary[]
  >([]);
  const [hasFetchedProfiles, setHasFetchedProfiles] = React.useState(false);

  const setUserProfiles = useSetUserProfiles();
  const userProfiles = useUserProfiles();

  useEffect(() => {
    if (profileId && !hasFetchedProfiles) {
      setUserProfiles(profileId);
      setHasFetchedProfiles(true);
    }
  }, [profileId, setUserProfiles, hasFetchedProfiles]);

  useEffect(() => {
    if (hasFetchedProfiles) {
      setCurrentUserProfiles(userProfiles);
    }
  }, [hasFetchedProfiles, userProfiles]);

  console.log(currentUserProfiles);

  return (
    <div>
      {currentUserProfiles.map((profile) => (
        <div
          key={profile.id}
          className="p-2 border-b cursor-pointer hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl || "/default-avatar.png"}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{`${profile.firstName} ${profile.lastName}`}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SideUsers;
