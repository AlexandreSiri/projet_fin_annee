import { request } from "."
import { Token, UserInterface } from "../../interfaces"

export const logout = () => {
    localStorage.removeItem("ACCESS_TOKEN")
    localStorage.removeItem("REFRESH_TOKEN")
}
export const getMe = async () => {
    const response = await request<UserInterface>("/auth/me", { method: "GET" })

    return response.type === "success" ? response.data : null
}
export const editMe = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
) => {
    const response = await request<UserInterface>("/auth/refresh", {
        method: "PATCH",
        body: {
            firstname,
            lastname,
            email,
            password: password.length ? password : undefined,
        },
    })
    return response
}
export const sendSupport = async (object: string, message: string) => {
    const response = await request<string>("/support", {
        method: "POST",
        body: {
            object,
            message,
        },
    })
    return response
}
export const refresh = async () => {
    const token = localStorage.getItem("REFRESH_TOKEN")
    if (!token) return null
    const response = await request<Token>("/auth/refresh", {
        method: "POST",
        body: {
            token,
        },
    })
    if (response.type !== "success") {
        localStorage.removeItem("ACCESS_TOKEN")
        localStorage.removeItem("REFRESH_TOKEN")
        return null
    } else {
        localStorage.setItem("ACCESS_TOKEN", response.data.session)
        localStorage.setItem("REFRESH_TOKEN", response.data.refresh)
        return response.data
    }
}
export const login = async (email: string, password: string) => {
    const response = await request<Token>("/auth/login", {
        method: "POST",
        body: { email, password },
    })
    return response
}
export const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
) => {
    const response = await request<string>("/auth/register", {
        method: "POST",
        body: { firstname, lastname, email, password },
    })
    return response
}
export const forget = async (email: string) => {
    const response = await request<string>("/auth/forget", {
        method: "POST",
        body: { email },
    })
    return response
}
