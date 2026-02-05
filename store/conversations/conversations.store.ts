import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ConversationStore, Conversation } from "./conversartions.types";
import {
  fetchConversationsAPI,
  fetchConversationsWithUnreadFirstAPI,
  markConversationAsReadAPI,
} from "@/lib/actions/conversations.actions";
import { Message, ProfileSummary } from "@/store/messages/messages.type";
import toast from "react-hot-toast";
import { useProfileStore } from "../profile/profile.store";

const initialState = {
  conversations: [] as Conversation[],
  isMessagePage: false,
  isLoadingConversations: false,
  isLoadingUnreadConversations: false,
  error: null as string | null,
  currentConversationPage: 1,
  selectedConversation: null as Conversation | null,
  isAllConversationsLoaded: false,
  _hasHydratedConversations: false,
  _hasFetchedConversationsWithUnreadFirst: false,
  conversationUnreadNotifications: [] as {
    conversationId: number;
    hasNotification: boolean;
    createdAt?: string;
    unreadCount?: number;
  }[], // Add this line
};

export const useConversationStore = create<ConversationStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // set whether we are on message page or not
      setIsMessagePage: (isMessagePage: boolean) => {
        set((state) => {
          state.isMessagePage = isMessagePage;
        });
      },

      // Logic: Merge new data with old data, prioritizing new data for duplicates
      setConversations: (incoming: Conversation[]) => {
        set((state) => {
          const conversationMap = new Map(
            state.conversations.map((c) => [c.id, c]),
          );

          incoming.forEach((conv) => {
            conversationMap.set(conv.id, conv);
          });

          state.conversations = Array.from(conversationMap.values());
        });
      },

      //set conversation unread notifications
      setConversationUnreadNotifications: (
        notifications: {
          conversationId: number;
          hasNotification: boolean;
          createdAt?: string;
          unreadCount?: number;
        }[],
      ) => {
        set((state) => {
          state.conversationUnreadNotifications = notifications;
        });
      },

      //remove or update conversation unread notification
      removeConversationUnreadNotification: (conversationId: number) => {
        set((state) => {
          state.conversationUnreadNotifications =
            state.conversationUnreadNotifications.filter(
              (n) => n.conversationId !== conversationId,
            );
        });
      },

      //fetch conversations with unread first
      fetchConversationsWithUnreadFirst: async (profileId: number) => {
        // Guard: Prevent double-fetching
        if (get().isLoadingConversations) return;

        set((state) => {
          state.isLoadingUnreadConversations = true;
          state.error = null;
        });

        const result = await fetchConversationsWithUnreadFirstAPI(profileId);

        if (result.success) {
          set((state) => {
            let incoming = result.data;
            // populate the unread notification array with conversations with their oldest message date, if any.
            const unreadNotifications = incoming
              .filter((c) => c.unreadCount && c.unreadCount > 0)
              .map((c) => {
                // Find the oldest date by comparing every message in the conversation
                const oldestDate =
                  c.messages[c.messages.length - (c.unreadCount! + 1)]
                    .createdAt;
                return {
                  conversationId: c.id,
                  hasNotification: true,
                  createdAt: oldestDate,
                  unreadCount: c.unreadCount,
                };
              });
            state.conversationUnreadNotifications = unreadNotifications;
            state.conversations = incoming;
            state.isLoadingUnreadConversations = false;
            state._hasFetchedConversationsWithUnreadFirst = true;
          });
        } else {
          set((state) => {
            state.isLoadingUnreadConversations = false;
            state.error =
              result.data instanceof Error ? result.data.message : "Failed";
          });
        }
      },

      //fetch more conversations from backend
      fetchConversations: async (profileId: number) => {
        // Guard: Prevent double-fetching the same page
        if (get().isLoadingConversations) return;

        set((state) => {
          state.isLoadingConversations = true;
          state.error = null;
        });

        const result = await fetchConversationsAPI(
          profileId,
          get().currentConversationPage,
        );

        if (result.success) {
          set((state) => {
            if (result.data.length === 0) {
              state.isAllConversationsLoaded = true;
            } else {
              const incoming = result.data;
              // Filter out any items that already exist in state to avoid duplicates
              const existingIds = new Set(state.conversations.map((c) => c.id));
              const uniqueNew = incoming.filter((c) => !existingIds.has(c.id));

              state.conversations.push(...uniqueNew);
              state.currentConversationPage += 1;
              state.isLoadingConversations = false;
            }
          });
        } else {
          set((state) => {
            state.isLoadingConversations = false;
            state.error =
              result.data instanceof Error ? result.data.message : "Failed";
          });
        }
      },

      // Add new conversation or set existing conversation as selected
      setSelectedConversation: async (conversation: Conversation | null) => {
        set((state) => {
          if (!conversation) {
            state.selectedConversation = null;
            return;
          }

          // Always use the reference from the array if it exists
          let found = get().conversations.find(
            (c) => c.otherParticipant.id === conversation.otherParticipant.id,
          );

          // add the conversation to the conversations array if it doesn't exist
          if (!found) {
            state.conversations.unshift(conversation);
            state.selectedConversation = conversation;
            return;
          }
          state.selectedConversation = found;
        });
        if (!conversation) return;

        //update the conversation as read if it has unread messages in the backend
        if (conversation.unreadCount && conversation.unreadCount > 0) {
          const profile = useProfileStore.getState().profile;
          if (!profile) return;
          try {
            const result = await markConversationAsReadAPI(
              conversation.id,
              profile.id,
            );
            if (!result.success) {
              throw new Error("Failed to mark conversation as read on server");
            }
            set((state) => {
              const conv = state.conversations.find(
                (c) => c.id === conversation.id,
              );
              if (conv) {
                conv.unreadCount = 0;
              }
            });
            get().updateUnreadCount(conversation!.id, 0);
            setTimeout(() => {
              // remove the special notification message if exists
              get().removeConversationUnreadNotification(conversation!.id);
              // reset the counters for the other participant on the backend to 0
            }, 120000); // 120 seconds to ensure the user sees the "your messages below this point are unread" notification before it disappears
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Unknown error marking conversation as read",
            );
          }
        }
      },

      //Add message to conversation
      addMessageToConversation: (
        conversationId: number,
        message: Message,
        otherParticipant?: ProfileSummary,
      ) => {
        set((state) => {
          let conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );
          if (conversation) {
            const exists = conversation.messages.some(
              (m) => m.id === message.id,
            );
            if (!exists) conversation.messages.push(message);
            // Always sync selectedConversation reference
            if (state.selectedConversation?.id === conversationId) {
              state.selectedConversation = conversation;
            }
          } else if (otherParticipant) {
            // New conversation: add to the beginning of the list
            const newConv = {
              id: conversationId,
              otherParticipant,
              messages: [message],
              currentPage: 1,
            };
            state.conversations.unshift(newConv);
            state.selectedConversation = newConv;
          }
        });
      },

      //remove message from conversation
      removeMessageFromConversation: (
        conversationId: number,
        messageId: string,
      ) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );
          if (!conversation) return;
          conversation.messages = conversation.messages.filter(
            (m) => m.id !== messageId,
          );

          // Also update selectedConversation if it's the one we are viewing
          if (state.selectedConversation?.id === conversationId) {
            state.selectedConversation = {
              ...conversation,
              messages: conversation.messages,
            };
          }
        });
      },

      //add more messages to conversation
      addMoreMessagesToConversation: (
        conversationId: number,
        messages: Message[],
      ) => {
        set((state) => {
          // Find the index so we can update the array directly
          const idx = state.conversations.findIndex(
            (c) => c.id === conversationId,
          );
          if (idx === -1) return;

          const existingMessages = state.conversations[idx].messages;

          // Create a Map for deduplication
          const messageMap = new Map(existingMessages.map((m) => [m.id, m]));
          messages.forEach((m) => messageMap.set(m.id, m));

          // Sort messages
          const sorted = Array.from(messageMap.values()).sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

          // Update the conversation in the array
          state.conversations[idx].messages = sorted;

          // Update selectedConversation if it's the one we are viewing
          if (state.selectedConversation?.id === conversationId) {
            // Re-assigning the whole object ensures the Proxy registers a significant change
            state.selectedConversation = {
              ...state.conversations[idx],
              messages: sorted,
            };
          }
        });
      },

      addNewMessagesToConversation: (
        conversationId: number,
        messages: Message[],
      ) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );
          if (!conversation) return;

          const existingMessages = conversation.messages;

          // Create a Map for deduplication
          const messageMap = new Map(existingMessages.map((m) => [m.id, m]));
          messages.forEach((m) => messageMap.set(m.id, m));

          // Sort messages
          const sorted = Array.from(messageMap.values()).sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

          // Update the conversation's messages
          conversation.messages = sorted;

          // Update selectedConversation if it's the one we are viewing
          if (state.selectedConversation?.id === conversationId) {
            state.selectedConversation = {
              ...conversation,
              messages: sorted,
            };
          }
        });
      },

      replaceConversationId: (oldId: number, newId: number) => {
        set((state) => {
          const conversation = state.conversations.find((c) => c.id === oldId);
          if (conversation) {
            conversation.id = newId;
          }
        });
      },

      replaceConversation: (
        oldConversationId: number,
        newConversation: Conversation,
      ) => {
        set((state) => {
          const conversationIdx = state.conversations.findIndex(
            (c) => c.id === oldConversationId,
          );
          if (conversationIdx !== -1) {
            state.conversations[conversationIdx] = newConversation;
            // Always set selectedConversation to the new reference from the array
            state.selectedConversation = state.conversations[conversationIdx];
          }
        });
      },

      replaceMessageInConversation: (
        conversationId: number,
        oldMessageId: string,
        updatedMessage: Message,
      ) => {
        set((state) => ({
          conversations: state.conversations.map((cv) => {
            // 1. Find the correct conversation
            if (cv.id !== conversationId) return cv;

            // 2. Return a new conversation object with updated messages array
            return {
              ...cv,
              messages: cv.messages.map((m) =>
                // 3. Replace only the specific message, keep others as they are
                m.id === oldMessageId ? updatedMessage : m,
              ),
            };
          }),
          // 4. Also update the 'selectedConversation' if it matches,
          // to ensure the active chat window reflects the change immediately.
          selectedConversation:
            state.selectedConversation?.id === conversationId
              ? {
                  ...state.selectedConversation,
                  messages: state.selectedConversation.messages.map((m) =>
                    m.id === oldMessageId ? updatedMessage : m,
                  ),
                }
              : state.selectedConversation,
        }));
      },

      //updating to counters locally because we save the counter on the backend when we save the message
      updateUnreadCount: (conversationId: number, count: number) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );
          if (conversation) {
            conversation.unreadCount = count;
          }
        });
      },

      clearConversations: () => {
        set(() => ({
          ...initialState,
        }));
      },

      // Add missing setters to match ConversationStore type
      setIsLoadingConversations: (isLoading: boolean) => {
        set((state) => {
          state.isLoadingConversations = isLoading;
        });
      },

      setIsLoadingUnreadConversations: (isLoading: boolean) => {
        set((state) => {
          state.isLoadingUnreadConversations = isLoading;
        });
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },

      setCurrentConversationPage: (page: number) => {
        set((state) => {
          state.currentConversationPage = page;
        });
      },
    })),
    {
      name: "conversation-store",
      storage: createJSONStorage(() => {
        // Fallback for mobile browsers with restricted localStorage
        if (typeof window === "undefined") return localStorage;

        try {
          // Test if localStorage is available and writable
          const test = "__storage_test__";
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return localStorage;
        } catch (e) {
          // Fallback to sessionStorage if localStorage fails (e.g., private browsing)
          console.warn(
            "localStorage unavailable, using sessionStorage as fallback",
          );
          return sessionStorage;
        }
      }),
      partialize: (state) => ({
        conversations: state.conversations,
        conversationUnreadNotifications: state.conversationUnreadNotifications,
        //this keeps the page counter up always
        // currentConversationPage: state.currentConversationPage,
        selectedConversation: state.selectedConversation,
      }),
      onRehydrateStorage: () => (state) => {
        state!._hasHydratedConversations = true;
      },
    },
  ),
);
