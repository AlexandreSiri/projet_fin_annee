import { Op } from "sequelize"
import { Request } from "../../../@types/express"
import User from "../../models/user.model"

export const generateToken = (size: number): string => {
    if (size <= 0) return ""
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        .repeat(64)
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
        .slice(0, size - 1)
}

export const registerVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.lastname) errors.push("Le nom est obligatoire.")
    else if (req.body.lastname.length < 2)
        errors.push("Le nom doit contenir au minimum 2 caractères.")
    else if (req.body.lastname.length > 32)
        errors.push("Le nom doit contenir au maximum 32 caractères.")

    if (!req.body.firstname) errors.push("Le prénom est obligatoire.")
    else if (req.body.firstname.length < 2)
        errors.push("Le prénom doit contenir au minimum 2 caractères.")
    else if (req.body.firstname.length > 32)
        errors.push("Le prénom doit contenir au maximum 32 caractères.")

    if (!req.body.email) errors.push("L'email est obligatoire.")
    else if (
        !/([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/g.test(
            req.body.email
        )
    )
        errors.push("L'email doit être au bon format.")
    else if (await User.findOne({ where: { email: req.body.email } }))
        errors.push("L'email est déjà utilisé par un autre compte.")

    if (!req.body.password) errors.push("Le mot de passe est obligatoire.")
    else if (req.body.password.length < 6)
        errors.push("Le mot de passe doit contenir au minimum 6 caractères.")

    if (
        req.body.phone?.length &&
        !/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/g.test(
            req.body.phone
        )
    )
        errors.push("Le numéro de téléphone doit être valide.")

    return errors
}
export const editVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (req.body.lastname && req.body.lastname.length < 2)
        errors.push("Le nom doit contenir au minimum 2 caractères.")
    if (req.body.lastname && req.body.lastname.length > 32)
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
            where: { id: { [Op.not]: req.user!.id }, email: req.body.email },
        }))
    )
        errors.push("L'email est déjà utilisé par un autre compte.")

    if (req.body.password && req.body.password.length < 6)
        errors.push("Le mot de passe doit contenir au minimum 6 caractères.")

    if (
        req.body.phone?.length &&
        !/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/g.test(
            req.body.phone
        )
    )
        errors.push("Le numéro de téléphone doit être valide.")

    return errors
}
export const contactVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.object) errors.push("L'objet est obligatoire")
    else if (req.body.object.length < 2)
        errors.push("L'objet doit contenir au minimum 2 caractères.")
    else if (req.body.object.length > 128)
        errors.push("L'objet doit contenir au maximum 128 caractères.")

    if (!req.body.message) errors.push("Le message est obligatoire.")
    else if (req.body.message.length < 2)
        errors.push("Le message doit contenir au minimum 2 caractères.")
    else if (req.body.message.length > 2048)
        errors.push("Le message doit contenir au maximum 2048 caractères.")

    return errors
}
export const forgetVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.email) errors.push("L'email est obligatoire.")
    else if (
        !/([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/g.test(
            req.body.email
        )
    )
        errors.push("L'email doit être au bon format.")

    return errors
}

export const resetVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []
    if (!req.body.password) errors.push("Le mot de passe est obligatoire.")
    else if (req.body.password.length < 6)
        errors.push("Le mot de passe doit contenir au minimum 6 caractères.")

    return errors
}
export const loginVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.email) errors.push("L'email est obligatoire.")
    if (!req.body.password) errors.push("Le mot de passe est obligatoire.")

    return errors
}
