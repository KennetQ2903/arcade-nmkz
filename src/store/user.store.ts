import {create} from 'zustand'

type State={
    user: User,
}

type Action={
    setUser: (user: User) => void
}

const initialState: User={id: '',name: '',email: '',rol_id: 0,created_at: '',localidad_id: null,dpi: '',fecha_nacimiento: '',phone: null,nit: null,lastname: ''}

export const useUserStore=create<State&Action>((set) => ({
    user: initialState,
    setUser: (user) => set({user}),
    resetUser: () => set({user: initialState}),
}))
