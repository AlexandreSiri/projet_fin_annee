import { request } from "."
import { LocationInterface, ReservationInterface } from "../../interfaces"

export const getLocations = async () => {
    const response = await request<LocationInterface[]>("/locations", {
        method: "GET",
    })
    return response
}
export const getLocation = async (id: number) => {
    const response = await request<LocationInterface>(`/locations/${id}`, {
        method: "GET",
    })
    return response
}
export const addLocation = async (label: string) => {
    const response = await request<LocationInterface>("/admin/locations", {
        method: "POST",
        body: {
            label,
        },
    })
    return response
}
export const getReservations = async () => {
    const response = await request<ReservationInterface[]>("/reservations", {
        method: "GET",
    })
    return response
}

export const createReservation = async (
    horse: number,
    location: number,
    date: Date
) => {
    const response = await request<ReservationInterface>(`/reservations`, {
        method: "POST",
        body: {
            horse,
            location,
            date,
        },
    })
    return response
}
export const deleteReservation = async (id: number | string) => {
    const response = await request<string>(`/reservations/${id}`, {
        method: "DELETE",
    })
    return response
}
export const getAdminUserReservations = async (id: number) => {
    const response = await request<ReservationInterface[]>(
        `/admin/users/${id}/reservations`,
        {
            method: "GET",
        }
    )
    return response
}
export const deleteAdminReservation = async (id: number) => {
    const response = await request<string>(`/admin/reservations/${id}`, {
        method: "DELETE",
    })
    return response
}
export const deleteAdminLocation = async (id: number) => {
    const response = await request<string>(`/admin/locations/${id}`, {
        method: "DELETE",
    })
    return response
}
