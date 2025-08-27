import { create } from "zustand";
import { IJob } from "../types";

interface IJobStore {
    jobs: IJob[],
    setJobs: (supps: IJob[]) => void
}

const useJobStore = create<IJobStore>()(
    (set) => ({
        jobs: [],
        setJobs: (jobs: IJob[]) => set({ jobs })
    })
);

export default useJobStore;