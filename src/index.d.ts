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

interface IShop {
    id: number
    created_at: string
    name: string,
    localidad_id: number,
    localidad: string
    direccion_completa: string,
    phone: string,
}

interface IArcadeMachineState {
    id: number
    created_at: string
    name: string
}

interface IArcadeMachineType {
    id: number
    created_at: string
    name: string
}

interface IArcadeMachine {
    id: number
    created_at: string
    state_id: number
    state: string
    provider_motherboard_id: number
    provider_motherboard: string
    provider_casing_id: number
    provider_casing: string
    model: string
    serial: string
    shop_id: number
    shop: string
    assembly_technician_id: number
    assembly_technician: string
    brand: string
    type_id: number
    type: string
}


enum ArcadeMachineType {
    Gabinete="Gabinete",               // Máquina arcade tradicional con gabinete
    Cocktail="Cocktail",               // Máquina arcade de mesa (estilo cocktail)
    Pinball="Pinball",                 // Máquina de pinball
    Conduccion="Conducción",           // Máquina de simulación de conducción
    Disparos="Disparos",               // Máquina de simulación de disparos
    Baile="Baile",                     // Máquina de baile (ej. Dance Dance Revolution)
    Lucha="Lucha",                     // Máquina de juegos de lucha
    Deportes="Deportes",               // Máquina de deportes (ej. juegos de fútbol, baloncesto)
    Grúa="Grúa",                       // Máquina de grúa (atrapa premios)
    Premios="Premios",                 // Máquina de premios
    Rompecabezas="Rompecabezas"        // Máquina de juegos de lógica y rompecabezas
}

enum ArcadeMachineHealthStatus {
    Operational="Operational",          // Operativa
    MinorIssue="Minor Issue",           // Problema menor
    CriticalFailure="Critical Failure", // Falla crítica
    UnderRepair="Under Repair",         // En reparación
    Assembling="Assembling"             // En ensamblaje
}

interface IRepairTicket {
    ticket_id: number
    created_at: string
    machine_id: number
    machine_serial: string
    machine_status: string
    technician_id: number
    technician: string
    repair_started_at: string
    repair_finished_at: string|null
}