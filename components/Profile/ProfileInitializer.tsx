"use client";

import { useEffect, useRef, useState } from "react";
import {
  useFetchBookings,
  useProfile,
  useProfileStore,
  useSetProfile,
  useSetProfileStats,
  useToolsHasHydrated,
} from "@/store";
import { User } from "@/store/profile/profile.types";
import { fetchUserProfile } from "@/lib/actions/profile.actions";

interface ProfileInitializerProps {
  user: User | null;
}

/**
 * Client component that initializes the Zustand profile store with server-fetched data.
 * Place this in your root layout or any layout where you want to hydrate the store.
 */
export function ProfileInitializer({ user }: ProfileInitializerProps) {
  const setUser = useProfileStore((state) => state.setUser);
  const fetchBookings = useFetchBookings();
  const hasHydrated = useProfileStore((state) => state._hasHydrated);
  const toolsHasHydrated = useToolsHasHydrated();
  const profile = useProfile();
  const setProfileStats = useSetProfileStats();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Only set user once after hydration to avoid re-render loops
    if (hasHydrated && user && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setUser(user);
    }
  }, [user, setUser, hasHydrated]);

  // update profile in the store when user changes
  // useEffect(() => {
  //   if (user && !hasInitializedRef.current && profile == null) {
  //     fetchProfile();
  //   }
  // }, [user]);

  useEffect(() => {
    if (profile) {
      fetchBookings(profile.id);
      //fetchbookings or other data if needed
    }
  }, [profile]);

  useEffect(() => {
    if (profile && toolsHasHydrated) {
      // Update profile stats when tools have hydrated
      setProfileStats();
    }
  }, [profile, toolsHasHydrated]);

  return null;
}

export default ProfileInitializer;
