import { useEffect } from "react";
import {
  useInitConversationSocketListeners,
  useInitializeNotificationSocket,
} from "@/store";
import { getSocket } from "@/lib/socket/socket";

export const useAppSocket = (profileId: number) => {
  const initChatSocketListeners = useInitConversationSocketListeners();
  const initNotificationSocketListeners = useInitializeNotificationSocket();

  useEffect(() => {
    if (!profileId) return;

    initChatSocketListeners(profileId);
    initNotificationSocketListeners(profileId);
    return () => {
      const socket = getSocket(profileId);
      socket.off("conversation:new_message");
      socket.off("notifications");
    };
  }, [profileId, initChatSocketListeners, initNotificationSocketListeners]);
};
