import { refresh } from "./auth"

const API_HOST = "https://api-uf.maximilien-bey.com"

type Response<T extends unknown> =
    | { type: "success"; data: T }
    | { type: "error"; message: string }

type OptionsGet = {
    method: "GET"
}
type OptionsPost = {
    method: "POST"
    body?: Record<string, any>
}
type OptionsDelete = {
    method: "DELETE"
}
type OptionsPatch = {
    method: "PATCH"
    body?: Record<string, any>
}
type Options = OptionsGet | OptionsPost | OptionsDelete | OptionsPatch

export const request = async <T>(
    path: string,
    options: Options,
    retry: boolean = false
): Promise<Response<T>> => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN")
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 10000)
    const response = await fetch(`${API_HOST}${path}`, {
        method: options.method,
        headers: {
            Accept: "application/json, text/plain, */*",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            "Content-Type": "application/json",
        },
        body:
            options.method === "POST" || options.method === "PATCH"
                ? JSON.stringify(options.body)
                : undefined,
        signal: controller.signal,
    }).catch((err: string) => `${err}`)
    if (typeof response === "string") {
        return {
            type: "error",
            message: response,
        }
    }
    if (response?.status === 401 && !retry) {
        const res = await refresh()
        if (res) return request<T>(path, options, true)
        else
            return {
                type: "error",
                message: "Unknown error.",
            }
    }
    const data = await response?.json().catch(() => null)

    if (!data)
        return {
            type: "error",
            message: "Unknown error.",
        }

    return data
}
