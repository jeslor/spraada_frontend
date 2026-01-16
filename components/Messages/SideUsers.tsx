"use client";

import React, { useEffect } from "react";
import {
  ProfileSummary,
  useMessageActions,
  useSetUserProfiles,
  useUserProfiles,
} from "@/store";

const SideUsers = ({ profileId }: { profileId?: number }) => {
  const [currentUserProfiles, setCurrentUserProfiles] = React.useState<
    ProfileSummary[]
  >([]);
  const [hasFetchedProfiles, setHasFetchedProfiles] = React.useState(false);

  const setUserProfiles = useSetUserProfiles();
  const userProfiles = useUserProfiles();
  const { getLastMessage } = useMessageActions();

  // Fetch user profiles when profileId changes
  useEffect(() => {
    if (profileId && !hasFetchedProfiles) {
      setUserProfiles(profileId);
      setHasFetchedProfiles(true);
    }
  }, [profileId, setUserProfiles, hasFetchedProfiles]);

  //set current user profiles when they are fetched
  useEffect(() => {
    if (hasFetchedProfiles) {
      setCurrentUserProfiles(userProfiles);
    }
  }, [hasFetchedProfiles, userProfiles]);

  return (
    <div>
      {currentUserProfiles.map((profile) => (
        <div
          key={profile.id}
          className="p-2  cursor-pointer hover:bg-primary/10  mb-1"
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
      ))}
    </div>
  );
};

export default SideUsers;
