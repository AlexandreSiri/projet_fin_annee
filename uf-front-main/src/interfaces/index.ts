export type Token = {
    session: string
    refresh: string
}

export interface RoleInterface {
    id: number
    label: "ADMINISTRATOR" | "PROFESSIONAL" | "USER"
    createdAt: Date
    updatedAt: Date
}

export interface JobInterface {
    id: number
    label: string
    price: number
    createdAt: Date
    updatedAt: Date
}

export interface UserInterface {
    id: number
    firstname: string
    lastname: string
    email: string
    phone?: string
    validated: boolean
    createdAt: Date
    updatedAt: Date
    role: RoleInterface
    jobs: JobInterface[]
}

export interface HorseInterface {
    id: number
    label: string
    birthAt: Date
    createdAt: Date
    updatedAt: Date
    user: UserInterface
}

export interface DisponibilityInterface {
    id: number
    beginAt: Date
    endAt: Date
    used: Date[]
    user: UserInterface
    job: JobInterface
}

export interface AppointmentInterface {
    id: number
    date: Date
    horse: HorseInterface
    disponibility: DisponibilityInterface
    createdAt: Date
    updatedAt: Date
}

export interface LocationInterface {
    id: number
    label: string
    used: Date[]
    createdAt: Date
    updatedAt: Date
}

export interface ReservationInterface {
    id: number
    date: Date
    horse: HorseInterface
    location: LocationInterface
    createdAt: Date
    updatedAt: Date
}

export interface SupportInterface {
    id: number
    object: string
    message: string
    user: UserInterface
    createdAt: Date
    updatedAt: Date
}
