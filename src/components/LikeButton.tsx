import { create } from 'zustand';

interface LikeState {
  likes: Record<number, number>;
  incrementLike: (id: number) => void;
}

export const useStore = create<LikeState>((set) => ({
  likes: {},
  incrementLike: (id) => set((state) => ({
    likes: {
      ...state.likes,
      [id]: (state.likes[id] || 0) + 1,
    },
  })),
}));
