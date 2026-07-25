import { create } from "zustand";

export type AchievementToast = {
  id: string;
  badgeKey: string;
};

type AchievementToastState = {
  toasts: AchievementToast[];
  pushToasts: (badgeKeys: string[]) => void;
  dismissToast: (id: string) => void;
};

export const useAchievementToastStore = create<AchievementToastState>(
  (set) => ({
    toasts: [],
    pushToasts: (badgeKeys) =>
      set((state) => ({
        toasts: [
          ...state.toasts.slice(-4),
          ...badgeKeys.map((badgeKey) => ({
            id: `${badgeKey}-${state.toasts.length}-${Math.random().toString(36).slice(2, 8)}`,
            badgeKey,
          })),
        ],
      })),
    dismissToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })),
  }),
);
