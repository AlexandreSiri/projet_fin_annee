import { Request, Response } from "../../@types/express"
import { JobInterface } from "../interfaces/admin.interface"
import Job from "../models/job.model"
import { createJobVerification } from "../utils/verifications/job.verification"

export const jobFormat = (job: Job): JobInterface => ({
    id: job.id,
    label: job.label,
    price: job.price,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
})

export const jobList = async (req: Request, res: Response<JobInterface[]>) => {
    const jobs = await Job.findAll().then(jobs => jobs.map(jobFormat))

    res.status(200).json({ type: "success", data: jobs })
}

export const jobCreate = async (
    req: Request<{ label: string; price: number }>,
    res: Response<JobInterface>
) => {
    const errors = await createJobVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const job = await Job.create({
        label: req.body.label,
        price: req.body.price,
    })

    return res.status(200).json({ type: "success", data: jobFormat(job) })
}

export const jobEdit = async (
    req: Request<{ price: number }, any, { id: string }>,
    res: Response<JobInterface>
) => {
    const errors = await createJobVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const job = await Job.findByPk(req.params.id)
    if (!job)
        return res
            .status(400)
            .json({ type: "error", message: "Job not found." })

    if (typeof req.body.price === "number") job.price = req.body.price

    await job.save()

    return res.status(200).json({ type: "success", data: jobFormat(job) })
}

export const jobDelete = async (
    req: Request<any, any, { id: string }>,
    res: Response<string>
) => {
    const job = await Job.findByPk(req.params.id)
    if (!job)
        return res
            .status(400)
            .json({ type: "error", message: "Job not found." })

    await job.destroy()
    res.status(200).json({
        type: "success",
        data: "Job supprimé avec succès.",
    })
}
