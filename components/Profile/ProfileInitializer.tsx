"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/store";
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
  const hasHydrated = useProfileStore((state) => state._hasHydrated);

  useEffect(() => {
    // Only set user after hydration to avoid overwriting persisted data
    if (hasHydrated && user) {
      setUser(user);
    }
  }, [user, setUser, hasHydrated]);

  return null;
}

export default ProfileInitializer;
