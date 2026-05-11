import { create } from 'zustand';

type AppState = {
  /** Reserved for future persistence / auth hydration gates */
  ready: boolean;
  setReady: (ready: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
}));
