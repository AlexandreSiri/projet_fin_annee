import { request } from "."
import { HorseInterface, JobInterface } from "../../interfaces"

export const getJobs = async () => {
    const response = await request<JobInterface[]>("/jobs", {
        method: "GET",
    })
    return response
}
export const addJob = async (label: string, price: number) => {
    const response = await request<HorseInterface>("/admin/jobs", {
        method: "POST",
        body: {
            label,
            price,
        },
    })
    return response
}
export const deleteJob = async (id: number) => {
    const response = await request<string>(`/admin/jobs/${id}`, {
        method: "DELETE",
    })
    return response
}
