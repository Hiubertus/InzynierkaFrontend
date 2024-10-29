// import { create } from 'zustand'
// import { Session, getSession, setSession, removeSession } from '@/lib/session/session'
//
// interface SessionState {
//     session: Session | null
//     isLoading: boolean
//     initialize: () => Promise<void>
//     setSessionData: (session: Session) => Promise<void>
//     clearSession: () => Promise<void>
// }
//
// export const useSessionStore = create<SessionState>((set) => ({
//     session: null,
//     isLoading: true,
//     initialize: async () => {
//         const sessionData = await getSession()
//         set({ session: sessionData, isLoading: false })
//     },
//     setSessionData: async (sessionData: Session) => {
//         await setSession(sessionData)
//         set({ session: sessionData })
//     },
//     clearSession: async () => {
//         await removeSession()
//         set({ session: null })
//     },
// }))