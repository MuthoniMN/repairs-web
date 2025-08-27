import { create } from "zustand";
import { IClient } from "../types";

interface IClientStore {
    clients: IClient[],
    setClients: (supps: IClient[]) => void
}

const useClientStore = create<IClientStore>()(
    (set) => ({
        clients: [],
        setClients: (clients: IClient[]) => set({ clients })
    })
);

export default useClientStore;