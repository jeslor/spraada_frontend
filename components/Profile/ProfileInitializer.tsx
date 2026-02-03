"use client";

import { useEffect, useRef, useState } from "react";
import {
  useConversations,
  useFetchBookings,
  useFetchConversations,
  useFetchConversationsWithUnreadFirst,
  useHasHydratedConversations,
  useProfile,
  useProfileStore,
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
  const hasHydratedConversations = useHasHydratedConversations();
  const conversations = useConversations();
  const fetchConversations = useFetchConversations();
  const fetchConversationsWithUnreadFirst =
    useFetchConversationsWithUnreadFirst();
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

  //fetchbookings or other data if needed
  useEffect(() => {
    if (profile) {
      fetchBookings(profile.id);
    }
  }, [profile]);

  // Update profile stats when tools have hydrated
  useEffect(() => {
    if (profile && toolsHasHydrated) {
      setProfileStats();
    }
  }, [profile, toolsHasHydrated]);

  /* Fetch conversations with unread messages first on mount if not already fetched */
  useEffect(() => {
    if (profile?.id) {
      //fetch conversations with unread messages first
      fetchConversationsWithUnreadFirst(profile.id);
    }
  }, [profile?.id]);

  return null;
}

export default ProfileInitializer;
