import { create } from "zustand";

type PresenceEntry = {
  online: boolean;
  lastSeenAt: string | null;
};

type PresenceState = {
  byUserId: Record<string, PresenceEntry>;
  setPresence: (
    userId: string,
    online: boolean,
    lastSeenAt: string | null,
  ) => void;
  seedOnline: (userId: string, online: boolean) => void;
};

export const usePresenceStore = create<PresenceState>((set) => ({
  byUserId: {},
  setPresence: (userId, online, lastSeenAt) =>
    set((state) => ({
      byUserId: {
        ...state.byUserId,
        [userId]: { online, lastSeenAt },
      },
    })),
  seedOnline: (userId, online) =>
    set((state) => {
      const existing = state.byUserId[userId];
      if (existing && existing.online === online) return state;
      return {
        byUserId: {
          ...state.byUserId,
          [userId]: {
            online,
            lastSeenAt: online ? null : (existing?.lastSeenAt ?? null),
          },
        },
      };
    }),
}));
