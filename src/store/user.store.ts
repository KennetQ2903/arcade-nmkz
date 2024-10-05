import {create} from 'zustand'

type State={
    user: User,
}

type Action={
    setUser: (user: User) => void
}

const initialState: User={id: '',nombre: '',email: '',role_id: 0,createdAt: ''}

export const useUserStore=create<State&Action>((set) => ({
    user: initialState,
    setUser: (user) => set({user}),
    resetUser: () => set({user: initialState}),
}))
