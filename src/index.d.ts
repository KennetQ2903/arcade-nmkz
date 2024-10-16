interface User {
    id: string
    name: string
    lastname: string
    email: string
    rol_id: number
    created_at: string
    localidad_id: number|null
    nit: string|null
    dpi: string
    fecha_nacimiento: string
    phone: string|null
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

interface IProvider {
    id: number
    created_at: string
    name: string
    phone: string
}