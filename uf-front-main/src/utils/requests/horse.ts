import { request } from "."
import { HorseInterface } from "../../interfaces"

export const getHorses = async () => {
    const response = await request<HorseInterface[]>("/horses", {
        method: "GET",
    })
    return response
}

export const getAdminHorse = async (id: number) => {
    const response = await request<HorseInterface>(`/admin/horses/${id}`, {
        method: "GET",
    })
    return response
}

export const getAdminUserHorses = async (id: number) => {
    const response = await request<HorseInterface[]>(
        `/admin/users/${id}/horses`,
        {
            method: "GET",
        }
    )
    return response
}
export const getAdminHorses = async () => {
    const response = await request<HorseInterface[]>("/admin/horses", {
        method: "GET",
    })
    return response
}
export const addHorse = async (label: string, birth: Date, user: number) => {
    const response = await request<HorseInterface>("/admin/horses", {
        method: "POST",
        body: {
            label,
            birth,
            user,
        },
    })
    return response
}
export const editHorse = async (
    id: number,
    label: string,
    birth: Date,
    user: number
) => {
    const response = await request<HorseInterface>(`/admin/horses/${id}`, {
        method: "PATCH",
        body: {
            label,
            birth,
            user,
        },
    })
    return response
}
export const deleteHorse = async (id: number) => {
    const response = await request<string>(`/admin/horses/${id}`, {
        method: "DELETE",
    })
    return response
}
