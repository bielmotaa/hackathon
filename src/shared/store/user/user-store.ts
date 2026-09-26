import {create} from "zustand"
import { UserInterface } from "@/shared/interfaces/user"
import {persist, createJSONStorage} from "zustand/middleware"
import AsyncStorage  from "@react-native-async-storage/async-storage"

interface setSessionParams {
    UserData: UserInterface
    token: string
    refreshToken?: string | null
}

interface UpdateTokensParams{
    token: string,
    refreshToken?: string | null
}

export interface UserStore {
    user: UserInterface | null
    token: string |  null
    refreshToken: string | null

    setSession: (sessionData: setSessionParams) => void
    logout: () => void
    updateTokens: (updateTokensData : UpdateTokensParams) => void
}

export const useUserStore = create<UserStore>()(
    persist(
     (set) => ({ 
        user: null,
        token: null,
        refreshToken: null,
    
        logout: () => set({ user: null, token: null, refreshToken: null }),
        setSession: (sessionData) => set({
            user: sessionData.UserData,
            token: sessionData.token,
            refreshToken: sessionData.refreshToken ?? null,
        }),
        updateTokens: (updateTokensData) => set({ ...updateTokensData })
     }), {
        name: "defesa-acao",
        storage: createJSONStorage (() => AsyncStorage)
    })
)