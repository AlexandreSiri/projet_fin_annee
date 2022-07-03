import { Request } from "express"
import { Op } from "sequelize"
import Job from "../../models/job.model"
import Role from "../../models/role.model"
import User from "../../models/user.model"

export const editUserVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (req.body.lastname && req.body.lastname.length < 2)
        errors.push("Le nom doit contenir au minimum 2 caractères.")
    else if (req.body.lastname && req.body.lastname.length > 32)
        errors.push("Le nom doit contenir au maximum 32 caractères.")

    if (req.body.firstname && req.body.firstname.length < 2)
        errors.push("Le prénom doit contenir au minimum 2 caractères.")
    else if (req.body.firstname && req.body.firstname.length > 32)
        errors.push("Le prénom doit contenir au maximum 32 caractères.")

    if (
        req.body.email &&
        !/([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/g.test(
            req.body.email
        )
    )
        errors.push("L'email doit être au bon format.")
    else if (
        req.body.email &&
        (await User.findOne({
            where: { id: { [Op.not]: req.params.id }, email: req.body.email },
        }))
    )
        errors.push("L'email est déjà utilisé par un autre compte.")

    if (req.body.role && !(await Role.findByPk(req.body.role)))
        errors.push("Role not found.")

    if (
        req.body.phone?.length &&
        !/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/g.test(
            req.body.phone
        )
    )
        errors.push("Le numéro de téléphone doit être valide.")

    if (req.body.jobs?.length && Array.isArray(req.body.jobs)) {
        const jobs: Job[] = []
        for (const jobId of req.body.jobs.filter(
            (j: string, i: number, s: string[]) => s.indexOf(j) === i
        )) {
            const job = await Job.findByPk(jobId)
            if (!job) {
                errors.push("Job not found.")
                break
            }
            jobs.push(job)
        }

        req.body.jobs = jobs
    } else if (req.body.jobs && !Array.isArray(req.body.jobs))
        errors.push("jobs need to be an array of id.")

    return errors
}
export const generateInvoiceVerification = async (
    req: Request
): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.date) errors.push("La date est obligatoire.")
    else if (isNaN((req.body.date = new Date(req.body.date)).getTime()))
        errors.push("La date doit être valide.")
    return errors
}
