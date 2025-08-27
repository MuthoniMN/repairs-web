import { create } from "zustand";
import { ISupplier } from "../types";

interface ISupplierStore {
    suppliers: ISupplier[],
    setSuppliers: (supps: ISupplier[]) => void
}

const useSupplierStore = create<ISupplierStore>()(
    (set) => ({
        suppliers: [],
        setSuppliers: (suppliers: ISupplier[]) => set({ suppliers })
    })
);

export default useSupplierStore;