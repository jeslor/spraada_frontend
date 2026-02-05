"use client";

import { useEffect, useRef } from "react";
import {
  useConversations,
  useFetchBookings,
  useFetchConversationsWithUnreadFirst,
  useHasFetchedConversationsWithUnreadFirst,
  useHasHydratedConversations,
  useProfile,
  useProfileStore,
  useSetProfileStats,
  useToolsHasHydrated,
} from "@/store";
import { User } from "@/store/profile/profile.types";

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
  const fetchConversationsWithUnreadFirst =
    useFetchConversationsWithUnreadFirst();
  const hasFetchedConversationsWithUnreadFirst =
    useHasFetchedConversationsWithUnreadFirst();
  const profile = useProfile();
  const setProfileStats = useSetProfileStats();
  const conversations = useConversations();
  const hasHydratedConversations = useHasHydratedConversations();
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
    // Only fetch if:
    // 1. We have a profile
    // 2. Store has fully hydrated from localStorage
    // 3. We haven't fetched yet OR conversations array is still empty
    if (
      profile?.id &&
      hasHydratedConversations &&
      (!hasFetchedConversationsWithUnreadFirst || conversations.length === 0)
    ) {
      fetchConversationsWithUnreadFirst(profile.id);
    }
  }, [
    profile?.id,
    hasHydratedConversations,
    hasFetchedConversationsWithUnreadFirst,
    conversations.length,
    fetchConversationsWithUnreadFirst,
  ]);

  return null;
}

export default ProfileInitializer;
