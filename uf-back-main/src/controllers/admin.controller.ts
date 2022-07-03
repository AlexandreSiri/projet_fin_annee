import { Op } from "sequelize"
import * as ejs from "ejs"
import { Request, Response } from "../../@types/express"
import {
    RoleInterface,
    SupportInterface,
    UserInterface,
} from "../interfaces/admin.interface"
import Appointment from "../models/appointment.model"
import Horse from "../models/horse.model"
import Job from "../models/job.model"
import Role from "../models/role.model"
import User from "../models/user.model"
import { formatDateInvoice, formatDateMonthInvoice } from "../utils/date"
import { sendEmail } from "../utils/mail"
import { generateInvoicePDF } from "../utils/puppeteer"
import {
    editUserVerification,
    generateInvoiceVerification,
} from "../utils/verifications/admin.verifications"
import { appointmentFormat } from "./appointment.controller"
import { jobFormat } from "./job.controller"
import Contact from "../models/contact.model"

export const roleFormat = (role: Role): RoleInterface => ({
    id: role.id,
    label: role.label,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
})

export const userFormat = async (user: User): Promise<UserInterface> => {
    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        validated: user.validated,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: await user.getRole().then(roleFormat),
        jobs: await user.getJobs().then(jobs => jobs.map(jobFormat)),
    }
}
export const supportFormat = async (
    contact: Contact
): Promise<SupportInterface> => {
    return {
        id: contact.id,
        object: contact.object,
        message: contact.message,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
        user: await contact.getUser().then(userFormat),
    }
}

export const roleList = async (
    req: Request,
    res: Response<RoleInterface[]>
) => {
    const roles = await Role.findAll().then(roles => roles.map(roleFormat))
    res.status(200).json({ type: "success", data: roles })
}

export const userList = async (
    req: Request,
    res: Response<UserInterface[]>
) => {
    const users = await User.findAll().then(users =>
        Promise.all(users.map(userFormat))
    )

    res.status(200).json({ type: "success", data: users })
}
export const userDetail = async (
    req: Request<any, any, { id: string }>,
    res: Response<UserInterface>
) => {
    const user = await User.findByPk(req.params.id)
    if (!user)
        return res
            .status(400)
            .json({ type: "error", message: "User not found." })

    res.status(200).json({ type: "success", data: await userFormat(user) })
}

export const userValidate = async (
    req: Request<any, unknown, { id: string }>,
    res: Response<string>
) => {
    const user = await User.findByPk(req.params.id)
    if (!user)
        return res
            .status(400)
            .json({ type: "error", message: "User not found." })

    if (user.validated)
        return res
            .status(400)
            .json({ type: "error", message: "User already validated." })

    user.validated = true
    await user.save()

    await sendEmail(
        user.email,
        `Écuries de Persévère, votre compte est désormais validé.`,
        await ejs.renderFile("src/templates/email.confirm.ejs", {
            email: user.email,
            name: `${user.firstname} ${user.lastname.toUpperCase()}`,
            url: process.env.WEB_APP_URL,
            support_email: process.env.EMAIL_SUPPORT,
        })
    )

    res.status(200).json({
        type: "success",
        data: "Compte validé avec succès.",
    })
}

export const userEdit = async (
    req: Request<
        {
            firstname?: string
            lastname?: string
            email?: string
            phone?: string
            role?: number
            jobs?: Job[]
        },
        any,
        { id: string }
    >,
    res: Response<UserInterface>
) => {
    const errors = await editUserVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const user = await User.findByPk(req.params.id)
    if (!user)
        return res
            .status(400)
            .json({ type: "error", message: "User not found." })

    if (req.body.firstname) user.firstname = req.body.firstname
    if (req.body.lastname) user.lastname = req.body.lastname
    if (req.body.email) user.email = req.body.email
    if (req.body.phone) user.phone = req.body.phone
    if (req.body.role) user.roleId = req.body.role

    if (req.body.jobs) {
        await user.removeJobs()
        await Promise.all(req.body.jobs.map(user.addJob))
    }
    await user.save()

    res.status(200).json({
        type: "success",
        data: await userFormat(user),
    })
}

export const userDelete = async (
    req: Request<any, any, { id: string }>,
    res: Response<string>
) => {
    const user = await User.findByPk(req.params.id)
    if (!user)
        return res
            .status(400)
            .json({ type: "error", message: "User not found." })

    await user.destroy()

    res.status(200).json({
        type: "success",
        data: "Compte supprimé avec succès.",
    })
}

export const generateInvoice = async (
    user: User,
    date: Date,
    mail: boolean
) => {
    const startAt = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-01`)
    const endAt = new Date(new Date(startAt).setMonth(startAt.getMonth() + 1))

    const appointments = await Horse.findAll({
        where: { userId: user.id },
    })
        .then(horses =>
            Promise.all(
                horses.map(horse =>
                    Appointment.findAll({
                        where: {
                            horseId: horse.id,
                            date: {
                                [Op.gte]: startAt,
                                [Op.lte]: endAt,
                            },
                        },
                    })
                )
            )
        )
        .then(appointments =>
            Promise.all(appointments.flat().map(appointmentFormat))
        )
    const file = await generateInvoicePDF(user, startAt, appointments)
    const url = `${process.env.API_APP_URL}/cdn/${file}`
    if (mail) {
        const date = formatDateMonthInvoice(startAt)
        await sendEmail(
            user.email,
            `Écuries de Persévère, la facture de ${date} est disponible`,
            await ejs.renderFile("src/templates/email.invoice.ejs", {
                date,
                created: formatDateInvoice(new Date()),
                name: `${user.firstname} ${user.lastname.toUpperCase()}`,
                total: appointments.reduce(
                    (r, a) => r + a.disponibility.job.price,
                    0
                ),
                url,
                support_url: `${process.env.WEB_APP_URL}/support`,
            }),
            file
        )
    }

    return url
}

export const userGenerateInvoice = async (
    req: Request<{ date: Date; mail?: boolean }, any, { id: string }>,
    res: Response<string>
) => {
    const errors = await generateInvoiceVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })
    const user = await User.findByPk(req.params.id)
    if (!user)
        return res
            .status(400)
            .json({ type: "error", message: "User not found." })

    const url = await generateInvoice(user, req.body.date, !!req.body.mail)
    return res.json({ type: "success", data: url })
}

export const supportList = async (
    req: Request,
    res: Response<SupportInterface[]>
) => {
    const supports = await Contact.findAll().then(contacts =>
        Promise.all(contacts.map(supportFormat))
    )
    res.json({ type: "success", data: supports })
}
export const supportDelete = async (
    req: Request<any, any, { id: string }>,
    res: Response<string>
) => {
    const contact = await Contact.findByPk(req.params.id)
    if (!contact)
        return res
            .status(400)
            .json({ type: "error", message: "Contact not found." })

    await contact.destroy()
    res.json({ type: "success", data: "Le message a bien été supprimé." })
}
