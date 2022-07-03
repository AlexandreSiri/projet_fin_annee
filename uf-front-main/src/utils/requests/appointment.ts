import { request } from "."
import { AppointmentInterface, DisponibilityInterface } from "../../interfaces"

export const getAppointments = async () => {
    const response = await request<AppointmentInterface[]>("/appointments", {
        method: "GET",
    })
    return response
}
export const getProfessionalAppointments = async () => {
    const response = await request<AppointmentInterface[]>(
        "/professional/appointments",
        {
            method: "GET",
        }
    )
    return response
}
export const createAppointment = async (
    horse: number,
    disponibility: number,
    date: Date
) => {
    const response = await request<AppointmentInterface>("/appointments", {
        method: "POST",
        body: {
            horse,
            disponibility,
            date,
        },
    })
    return response
}
export const deleteAppointment = async (id: number | string) => {
    const response = await request<string>(`/appointments/${id}`, {
        method: "DELETE",
    })
    return response
}
export const getJobDisponibilities = async (id: number) => {
    const response = await request<DisponibilityInterface[]>(
        `/jobs/${id}/disponibilities`,
        {
            method: "GET",
        }
    )
    return response
}
export const getProfessionalDisponibilities = async () => {
    const response = await request<DisponibilityInterface[]>(
        "/professional/disponibilities",
        {
            method: "GET",
        }
    )
    return response
}

export const createDisponibility = async (
    begin: Date,
    end: Date,
    user: number,
    job: number
) => {
    const response = await request<DisponibilityInterface>(
        "/admin/disponibilities",
        {
            method: "POST",
            body: {
                beginAt: begin.toString(),
                endAt: end.toString(),
                user,
                job,
            },
        }
    )
    return response
}
export const deleteDisponibility = async (id: string) => {
    const response = await request<string>(`/admin/disponibilities/${id}`, {
        method: "DELETE",
    })
    return response
}
export const getAdminDisponibilities = async () => {
    const response = await request<DisponibilityInterface[]>(
        "/admin/disponibilities",
        {
            method: "GET",
        }
    )
    return response
}
export const getAdminUserAppointments = async (id: number) => {
    const response = await request<AppointmentInterface[]>(
        `/admin/users/${id}/appointments`,
        {
            method: "GET",
        }
    )
    return response
}

export const deleteAdminAppointment = async (id: number) => {
    const response = await request<string>(`/admin/appointments/${id}`, {
        method: "DELETE",
    })
    return response
}
