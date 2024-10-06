interface User {
    id: string
    name: string
    email: string
    rol_id: number
    created_at: string
    localidad_id: number|null
}

interface ILocalization {
    id: number
    name: string
    created_at: string
}

interface IRol {
    id: number
    name: string
    created_at: string
}