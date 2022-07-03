import { Request } from "express"
import User from "../../models/user.model"

export const createHorseVerification = async (
    req: Request
): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.label) errors.push("Le label est obligatoire.")
    else if (req.body.label.length < 2)
        errors.push("Le label doit contenir au minimum 2 caractères.")
    else if (req.body.label.length > 24)
        errors.push("Le label doit contenir au maximum 24 caractères.")

    if (!req.body.user) errors.push("L'utilisateur est obligatoire.")
    else if (!(await User.findByPk(req.body.user)))
        errors.push("User not found.")

    if (!req.body.birth) errors.push("La date de naissance est obligatoire.")
    else if (isNaN((req.body.birth = new Date(req.body.birth)).getTime()))
        errors.push("La date de naissance doit être au bon format.")
    return errors
}
export const editHorseVerification = async (
    req: Request
): Promise<string[]> => {
    const errors: string[] = []

    if (req.body.label && req.body.label.length < 2)
        errors.push("Le label doit contenir au minimum 2 caractères.")
    else if (req.body.label && req.body.label.length > 24)
        errors.push("Le label doit contenir au maximum 24 caractères.")

    if (req.body.user && !(await User.findByPk(req.body.user)))
        errors.push("User not found.")

    if (
        req.body.birth &&
        isNaN((req.body.birth = new Date(req.body.birth)).getTime())
    )
        errors.push("La date de naissance doit être au bon format.")
    return errors
}
