import { Request, Response } from "../../@types/express"
import {
    AppointmentInterface,
    DisponibilityInterface,
} from "../interfaces/admin.interface"
import Appointment from "../models/appointment.model"
import Disponibility from "../models/disponibility.model"
import Horse from "../models/horse.model"
import Job from "../models/job.model"
import UserJob from "../models/user.job.model"
import User from "../models/user.model"
import {
    createAppointmentVerification,
    createDisponibilityVerification,
} from "../utils/verifications/appointment.verification"
import { userFormat } from "./admin.controller"
import { horseFormat } from "./horse.controller"
import { jobFormat } from "./job.controller"

export const disponibilityFormat = async (
    disponibility: Disponibility
): Promise<DisponibilityInterface> => ({
    id: disponibility.id,
    beginAt: disponibility.beginAt,
    endAt: disponibility.endAt,
    used: await disponibility
        .getAppointments()
        .then(appointments => appointments.map(a => a.date)),
    user: await UserJob.findByPk(disponibility.userJobId)
        .then(uj => uj?.getUser())
        .then(user => userFormat(user!)),
    job: await UserJob.findByPk(disponibility.userJobId)
        .then(uj => uj?.getJob())
        .then(job => jobFormat(job!)),
})
export const appointmentFormat = async (
    appointment: Appointment
): Promise<AppointmentInterface> => ({
    id: appointment.id,
    date: appointment.date,
    horse: await appointment.getHorse().then(horseFormat),
    disponibility: await appointment
        .getDisponibility()
        .then(disponibilityFormat),
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
})

// Disponibility
export const disponibilityList = async (
    req: Request,
    res: Response<DisponibilityInterface[]>
) => {
    const disponibilities = await Disponibility.findAll().then(
        disponibilities => Promise.all(disponibilities.map(disponibilityFormat))
    )

    return res.json({ type: "success", data: disponibilities })
}

export const jobDisponibilityList = async (
    req: Request<any, any, { id: string }>,
    res: Response<DisponibilityInterface[]>
) => {
    const job = await Job.findByPk(req.params.id)
    if (!job)
        return res
            .status(400)
            .json({ type: "error", message: "Job not found." })

    const userJobs = await UserJob.findAll({ where: { jobId: job.id } })
    const disponibilities = await Promise.all(
        userJobs.map(uj => uj.getDisponibilities())
    )
        .then(disponibilities =>
            Promise.all(disponibilities.flat().map(disponibilityFormat))
        )
        .then(disponibilities =>
            disponibilities.filter(
                d =>
                    d.beginAt.getTime() >= new Date().getTime() &&
                    d.endAt.getTime() <=
                        new Date(
                            new Date().getTime() + 2 * 7 * 24 * 3600 * 1000
                        ).getTime()
            )
        )

    res.json({ type: "success", data: disponibilities })
}

export const disponibilityDetail = async (
    req: Request<any, any, { id: string }>,
    res: Response<DisponibilityInterface>
) => {
    const disponibility = await Disponibility.findByPk(req.params.id)
    if (!disponibility)
        return res
            .status(400)
            .json({ type: "error", message: "Disponibility not found." })

    res.json({
        type: "success",
        data: await disponibilityFormat(disponibility),
    })
}
export const userDisponibilityList = async (
    req: Request<any, any, { id: string }>,
    res: Response<DisponibilityInterface[]>
) => {
    const user = await User.findByPk(req.params.id)
    if (!user)
        return res
            .status(400)
            .json({ type: "error", message: "User not found." })

    const disponibilities = await UserJob.findAll({
        where: { userId: user.id },
    })
        .then(userJobs =>
            Promise.all(userJobs.map(uj => uj.getDisponibilities()))
        )
        .then(disponibilities =>
            Promise.all(disponibilities.flat().map(disponibilityFormat))
        )

    return res.json({ type: "success", data: disponibilities })
}
export const professionalDisponibilityList = async (
    req: Request,
    res: Response<DisponibilityInterface[]>
) => {
    const disponibilities = await UserJob.findAll({
        where: { userId: req.user!.id },
    })
        .then(userJobs =>
            Promise.all(userJobs.map(uj => uj.getDisponibilities()))
        )
        .then(disponibilities =>
            Promise.all(disponibilities.flat().map(disponibilityFormat))
        )

    return res.json({ type: "success", data: disponibilities })
}
export const disponibilityCreate = async (
    req: Request<{
        user: number
        job: number
        beginAt: Date
        endAt: Date
    }>,
    res: Response<DisponibilityInterface>
) => {
    const errors = await createDisponibilityVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const userJob = await UserJob.findOne({
        where: {
            userId: req.body.user,
            jobId: req.body.job,
        },
    })
    if (!userJob)
        return res
            .status(400)
            .json({ type: "error", message: "User doesn't own this job." })

    const disponibility = await Disponibility.create({
        beginAt: req.body.beginAt,
        endAt: req.body.endAt,
        userJobId: userJob.id,
    }).then(disponibilityFormat)

    return res.json({ type: "success", data: disponibility })
}

export const disponibilityDelete = async (
    req: Request<any, unknown, { id: string }>,
    res: Response<string>
) => {
    const disponibility = await Disponibility.findByPk(req.params.id)
    if (!disponibility)
        return res
            .status(400)
            .json({ type: "error", message: "Disponibility not found." })

    await disponibility.destroy()

    res.status(200).json({
        type: "success",
        data: "Disponibilité supprimée avec succès.",
    })
}

// Appointment
export const appointmentList = async (
    req: Request,
    res: Response<AppointmentInterface[]>
) => {
    const appointments = await Appointment.findAll().then(appointments =>
        Promise.all(appointments.map(appointmentFormat))
    )

    res.json({
        type: "success",
        data: appointments,
    })
}

export const myAppointmentList = async (
    req: Request,
    res: Response<AppointmentInterface[]>
) => {
    const appointments = await Horse.findAll({
        where: { userId: req.user!.id },
    })
        .then(horses =>
            Promise.all(horses.map(horse => horse.getAppointments()))
        )
        .then(appointments =>
            Promise.all(appointments.flat().map(appointmentFormat))
        )

    res.json({ type: "success", data: appointments })
}

export const professionalAppointmentList = async (
    req: Request,
    res: Response<AppointmentInterface[]>
) => {
    const appointments = await UserJob.findAll({
        where: { userId: req.user!.id },
    })
        .then(userJobs =>
            Promise.all(userJobs.map(uj => uj.getDisponibilities()))
        )
        .then(disponibilities =>
            Promise.all(disponibilities.flat().map(d => d.getAppointments()))
        )
        .then(appointments =>
            Promise.all(appointments.flat().map(appointmentFormat))
        )

    return res.json({ type: "success", data: appointments })
}

export const userAppointmentList = async (
    req: Request<any, any, { id: string }>,
    res: Response<AppointmentInterface[]>
) => {
    const appointments = await Horse.findAll({
        where: { userId: req.params.id },
    })
        .then(horses =>
            Promise.all(horses.map(horse => horse.getAppointments()))
        )
        .then(appointments =>
            Promise.all(appointments.flat().map(appointmentFormat))
        )

    res.json({ type: "success", data: appointments })
}

export const myAppointmentCreate = async (
    req: Request<{
        date: Date
        horse: number
        disponibility: number
    }>,
    res: Response<AppointmentInterface>
) => {
    const errors = await createAppointmentVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const appointment = await Appointment.create({
        date: req.body.date,
        horseId: req.body.horse,
        disponibilityId: req.body.disponibility,
    }).then(appointmentFormat)

    res.json({ type: "success", data: appointment })
}

export const myAppointmentDelete = async (
    req: Request<any, any, { id: string }>,
    res: Response<string>
) => {
    const appointment = await Appointment.findByPk(req.params.id)
    if (!appointment)
        return res
            .status(400)
            .json({ type: "error", message: "Appointment not found." })

    if (
        await appointment
            .getHorse()
            .then(horse => horse.userId !== req.user?.id)
    )
        return res.status(400).json({
            type: "error",
            message: "User doesn't own this appointment.",
        })

    await appointment.destroy()
    res.json({ type: "success", data: "Rendez-vous supprimé avec succès." })
}
export const appointmentDelete = async (
    req: Request<any, any, { id: string }>,
    res: Response<string>
) => {
    const appointment = await Appointment.findByPk(req.params.id)
    if (!appointment)
        return res
            .status(400)
            .json({ type: "error", message: "Appointment not found." })

    await appointment.destroy()
    res.json({ type: "success", data: "Rendez-vous supprimé avec succès." })
}
