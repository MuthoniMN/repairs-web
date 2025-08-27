import { create } from "zustand";
import { IInvite } from "../types";

type TInviteStore = {
    invite: IInvite | null,
    setInvite: (inv: IInvite | null) => void
}

const useInviteStore = create<TInviteStore>()(
    (set) => ({
        invite: null,
        setInvite: (invite: IInvite | null) => set({ invite })
    })
)

export default useInviteStore;