import { useEffect } from "react";
import {
  useInitializeChatSocket,
  useInitializeNotificationSocket,
} from "@/store";
import { getSocket } from "@/lib/socket/socket";

export const useAppSocket = (profileId: number) => {
  const initChatSocketListeners = useInitializeChatSocket();
  const initNotificationSocketListeners = useInitializeNotificationSocket();

  useEffect(() => {
    if (!profileId) return;

    initChatSocketListeners(profileId);
    initNotificationSocketListeners(profileId);
    return () => {
      const socket = getSocket(profileId);
      socket.off("chats");
      socket.off("notifications");
    };
  }, [profileId, initChatSocketListeners, initNotificationSocketListeners]);
};
