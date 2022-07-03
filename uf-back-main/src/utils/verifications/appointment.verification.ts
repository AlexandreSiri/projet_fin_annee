import { Op } from "sequelize"
import { Request } from "../../../@types/express"
import Appointment from "../../models/appointment.model"
import Disponibility from "../../models/disponibility.model"
import Horse from "../../models/horse.model"
import Job from "../../models/job.model"
import UserJob from "../../models/user.job.model"
import User from "../../models/user.model"

export const createDisponibilityVerification = async (
    req: Request
): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.beginAt) errors.push("La date de départ est obligatoire.")
    else if (isNaN((req.body.beginAt = new Date(req.body.beginAt)).getTime()))
        errors.push("La date de départ doit être au bon format.")
    else if (req.body.beginAt.getTime() % (3600 * 1000))
        errors.push("La date de départ doit être une heure pile.")

    if (!req.body.endAt) errors.push("La date de fin est obligatoire.")
    else if (isNaN((req.body.endAt = new Date(req.body.endAt)).getTime()))
        errors.push("La date de fin doit être au bon format.")
    else if (req.body.endAt.getTime() % (3600 * 1000))
        errors.push("La date de fin doit être une heure pile.")

    if (
        !errors.length &&
        req.body.beginAt.getTime() >= req.body.endAt.getTime()
    )
        errors.push("La date de fin doit être supérieur à celle de départ.")

    if (!req.body.user) errors.push("L'utilisateur est obligatoire.")
    else if (!req.body.job) errors.push("Le job est obligatoire.")
    else {
        const user = await User.findByPk(req.body.user)
        const job = await Job.findByPk(req.body.job)
        if (!user) errors.push("User not found.")
        else if (!job) errors.push("Job not found.")
        else {
            req.body.user = parseInt(req.body.user)
            req.body.job = parseInt(req.body.job)
        }
    }

    const userJob = errors.length
        ? null
        : await UserJob.findOne({
              where: { userId: req.body.user, jobId: req.body.job },
          })
    if (!userJob) errors.push("User doesn't own this job.")

    if (
        !errors.length &&
        userJob &&
        (await Disponibility.findOne({
            where: {
                [Op.or]: [
                    {
                        beginAt: {
                            [Op.gte]: req.body.beginAt,
                            [Op.lt]: req.body.endAt,
                        },
                        userJobId: userJob.id,
                    },
                    {
                        endAt: {
                            [Op.gt]: req.body.beginAt,
                            [Op.lte]: req.body.endAt,
                        },
                        userJobId: userJob.id,
                    },
                    {
                        beginAt: {
                            [Op.lt]: req.body.beginAt,
                        },
                        endAt: {
                            [Op.gt]: req.body.endAt,
                        },
                        userJobId: userJob.id,
                    },
                ],
            },
        }))
    )
        errors.push("Une disponibilité est déjà présente durant cette période.")
    return errors
}

export const createAppointmentVerification = async (
    req: Request
): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.disponibility) return ["La disponibilité est obligatoire."]
    const disponibility = await Disponibility.findByPk(req.body.disponibility)
    if (!disponibility) return ["Disponibility not found."]
    else req.body.disponibility = parseInt(req.body.disponibility)

    if (!req.body.date) errors.push("La date de départ est obligatoire.")
    else if (isNaN((req.body.date = new Date(req.body.date)).getTime()))
        errors.push("La date doit être au bon format.")
    else if (req.body.date.getTime() % (3600 * 1000))
        errors.push("La date doit être une heure pile.")

    if (errors.length) return errors

    const endAt = new Date(req.body.date.getTime() + 3600 * 1000)
    if (req.body.date < disponibility.beginAt || endAt > disponibility.endAt)
        errors.push("La date doit être compris dans la disponibilité.")

    if (
        await Appointment.findOne({
            where: { date: req.body.date, disponibilityId: disponibility.id },
        })
    )
        errors.push("Un rendez-vous est déjà pris sur ce créneau.")

    if (!req.body.horse) errors.push("Le cheval est obligatoire.")
    else {
        const horse = await Horse.findByPk(req.body.horse)
        if (!horse) errors.push("Horse not found.")
        else if (horse.userId !== req.user?.id)
            errors.push("User doesn't own this horse.")
        else req.body.horse = parseInt(req.body.horse)
    }

    return errors
}
