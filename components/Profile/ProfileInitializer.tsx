"use client";

import { useEffect, useRef } from "react";
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
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Only set user once after hydration to avoid re-render loops
    if (hasHydrated && user && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setUser(user);
    }
  }, [user, setUser, hasHydrated]);

  return null;
}

export default ProfileInitializer;
