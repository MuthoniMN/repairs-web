import { create } from "zustand";
import { IRole, IUser } from "../types";
import { persist } from "zustand/middleware";

interface IAuthStore {
    accessToken: string,
    refreshToken: string,
    user: IUser | null,
    role: IRole | null,
    isAuthenticated: boolean,
    setAuthenticated: (accessToken: string, refreshToken: string, user: IUser, role: IRole) => void,
    setUpdatedTokens: (accessToken: string, refreshToken: string) => void,
    reset: () => void
}

const useAuthStore = create<IAuthStore>()(
    persist(
        (set, get, store) => ({
            accessToken: '',
            refreshToken: '',
            user: { name: 'Michelle', email: 'ndianguimichelle@gmail.com' } as IUser,
            role: null,
            isAuthenticated: false,
            setAuthenticated: (accessToken: string, refreshToken: string, user: IUser, role: IRole) => set({ accessToken, refreshToken, user, role }),
            setUpdatedTokens: (accessToken: string, refreshToken: string) => set({ accessToken, refreshToken }),
            reset: () => set(store.getInitialState(), true)
        }),
        {
            name: 'auth-storage'
        })
)

export default useAuthStore;