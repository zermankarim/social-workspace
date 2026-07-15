import { create } from "zustand";

export type MessagingToast = {
  id: string;
  conversationId: string;
  title: string;
  body: string;
};

type MessagingUiState = {
  activeConversationId: string | null;
  toasts: MessagingToast[];
  setActiveConversationId: (id: string | null) => void;
  pushToast: (toast: Omit<MessagingToast, "id">) => void;
  dismissToast: (id: string) => void;
};

export const useMessagingUiStore = create<MessagingUiState>((set) => ({
  activeConversationId: null,
  toasts: [],
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  pushToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts.slice(-4),
        {
          ...toast,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        },
      ],
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
