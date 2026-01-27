"use client";

import ProfileContent from "@/components/Profile/ProfileContent";
import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";
import { fetchUserProfile } from "@/lib/actions/profile.actions";
import { useProfile, useSetProfile, useUser } from "@/store";
import { useEffect, useState } from "react";

const page = () => {
  const [hasRefetchedProfile, setHasRefetchedProfile] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const user = useUser();
  const profile = useProfile();
  const setProfile = useSetProfile();

  useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
    }
  }, [user]);

  const fetchProfileOnOnboarding = async () => {
    const fetchProfile = await fetchUserProfile(user?.id!);
    if (fetchProfile.success && fetchProfile.data) {
      setProfile(fetchProfile.data);
      setHasRefetchedProfile(true);
    }
  };

  if (!hasRefetchedProfile && !profile && user?.id) {
    fetchProfileOnOnboarding();
  }

  useEffect(() => {
    setIsOwnProfile(user?.id === profile?.userId);
  }, [user, profile]);

  return profile ? (
    <ProfileContent isOwnProfile={isOwnProfile} />
  ) : (
    <ProfileSkeleton />
  );
};

export default page;
