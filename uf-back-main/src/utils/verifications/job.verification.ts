import { Request } from "express"
import Job from "../../models/job.model"

export const createJobVerification = async (
    req: Request
): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.label) errors.push("Le label est obligatoire.")
    else if (req.body.label.length < 2)
        errors.push("Le label doit contenir au minimum 2 caractères.")
    else if (req.body.label.length > 32)
        errors.push("Le label doit contenir au maximum 32 caractères.")
    else if (await Job.findOne({ where: { label: req.body.label } }))
        errors.push("Un job existe déjà avec ce label.")

    if (!req.body.price) errors.push("Le prix est obligatoire.")
    else if (isNaN((req.body.price = parseFloat(req.body.price))))
        errors.push("Le prix doit être valide.")
    else if (req.body.price < 0 || req.body.price > 100)
        errors.push("Le prix doit être compris entre 0 et 100.")

    return errors
}

export const editJobVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (req.body.price && isNaN((req.body.price = parseFloat(req.body.price))))
        errors.push("Le prix doit être valide.")
    else if (req.body.price && (req.body.price < 0 || req.body.price > 100))
        errors.push("Le prix doit être compris entre 0 et 100.")

    return errors
}
