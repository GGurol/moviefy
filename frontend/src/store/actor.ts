import { create } from "zustand";

interface ActorState {
  leaderActors: [];
  setLeaderActors: (actors: []) => void;
}

const actorStore = (set, get) => ({
  leaderActors: [],
  setLeaderActors: (actors) => {
    set((state) => ({
      leaderActors: [...state.leaderActors, ...actors],
    }));
  },
  returnActors: () => {
    return get().leaderActors;
  },
  reset: () => {
    set({
      leaderActors: [],
    });
  },
});

const useActorStore = create<ActorState>(actorStore);

export default useActorStore;
