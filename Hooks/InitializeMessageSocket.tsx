import { useEffect } from "react";
import { useInitializeChatSocket } from "@/store";
import { getSocket } from "@/lib/socket/socket";

export const useChatSocket = (profileId: number) => {
  const initSocketListeners = useInitializeChatSocket();

  useEffect(() => {
    if (!profileId) return;

    initSocketListeners(profileId);

    return () => {
      const socket = getSocket(profileId);
      socket.off("chats");
    };
  }, [profileId, initSocketListeners]);
};
