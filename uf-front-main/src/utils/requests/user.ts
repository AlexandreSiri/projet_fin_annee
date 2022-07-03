import { request } from "."
import {
    RoleInterface,
    SupportInterface,
    UserInterface,
} from "../../interfaces"

export const getUsers = async () => {
    const response = await request<UserInterface[]>("/admin/users", {
        method: "GET",
    })
    return response
}
export const getUser = async (id: number) => {
    const response = await request<UserInterface>(`/admin/users/${id}`, {
        method: "GET",
    })
    return response
}
export const verifyUser = async (id: number) => {
    const response = await request<string>(`/admin/users/${id}/validate`, {
        method: "POST",
    })
    return response
}
export const generateInvoice = async (user: number, date: Date) => {
    const response = await request<string>(`/admin/users/${user}/invoices`, {
        method: "POST",
        body: {
            date,
            mail: true,
        },
    })
    return response
}
export const getSupports = async () => {
    const response = await request<SupportInterface[]>("/admin/supports", {
        method: "GET",
    })
    return response
}
export const deleteSupport = async (id: number) => {
    const response = await request<string>(`/admin/supports/${id}`, {
        method: "DELETE",
    })
    return response
}
export const editUser = async (
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    role: number,
    jobs: number[]
) => {
    const response = await request<UserInterface>(`/admin/users/${id}`, {
        method: "PATCH",
        body: {
            firstname,
            lastname,
            email,
            role,
            jobs,
        },
    })
    return response
}
export const deleteUser = async (id: number) => {
    const response = await request<string>(`/admin/users/${id}`, {
        method: "DELETE",
    })
    return response
}

export const getRoles = async () => {
    const response = await request<RoleInterface[]>("/admin/roles", {
        method: "GET",
    })
    return response
}
