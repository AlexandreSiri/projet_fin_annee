import { hashSync, compareSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import * as ejs from "ejs"
import { UserCreationAttribute } from "../interfaces/auth.interface"
import User from "../models/user.model"
import {
    contactVerification,
    editVerification,
    forgetVerification,
    loginVerification,
    registerVerification,
    resetVerification,
} from "../utils/verifications/auth.verifications"
import Access from "../models/access.model"
import { REFRESH_EXPIRATION, SIGNATURE } from "../utils/auth.utils"
import { generateToken, getToken, unsignToken } from "../utils/basic"
import Role from "../models/role.model"
import { Request, Response } from "../../@types/express"
import { UserInterface } from "../interfaces/admin.interface"
import { userFormat } from "./admin.controller"
import Reset from "../models/reset.model"
import { Op } from "sequelize"
import { sendEmail } from "../utils/mail"
import Contact from "../models/contact.model"

export const createUser = async (
    attribute: Omit<UserCreationAttribute, "roleId">
): Promise<User | null> => {
    const password = hashSync(attribute.password, 10)

    const role = await Role.findOne({
        where: {
            label: "USER",
        },
    })
    if (!role) return null

    const user = await User.create({
        firstname: attribute.firstname,
        lastname: attribute.lastname,
        email: attribute.email,
        password,
        phone: attribute.phone,
        roleId: role.id,
        validated: false,
    })
    return user
}

export const handleRegister = async (req: Request, res: Response<string>) => {
    const errors = await registerVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const user = await createUser(req.body)
    if (!user)
        return res.status(500).json({ type: "error", message: "Server error." })

    await sendEmail(
        user.email,
        `Écuries de Persévère, votre compte a été créé.`,
        await ejs.renderFile("src/templates/email.register.ejs", {
            email: user.email,
            name: `${user.firstname} ${user.lastname.toUpperCase()}`,
            support_email: process.env.EMAIL_SUPPORT,
        })
    )

    return res.json({
        type: "success",
        data: "Votre compte a été créé, un email vous sera envoyé lors de la validation de celui-ci.",
    })
}

export const handleLogin = async (
    req: Request,
    res: Response<{ session: string; refresh: string }>
) => {
    const errors = await loginVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const email: string = req.body.email
    const password: string = req.body.password

    const user = await User.findOne({ where: { email } })
    if (!user || !compareSync(password, user.password))
        return res.status(400).json({
            type: "error",
            message: "Email ou mot de passe invalide.",
        })
    if (!user.validated)
        return res.status(400).json({
            type: "error",
            message: "Votre compte n'est pas encore validé.",
        })
    const sessionToken = generateToken(50)
    const refreshToken = generateToken(50)
    await Access.create({
        refresh: refreshToken,
        session: sessionToken,
        expireAt: new Date(
            new Date().setDate(new Date().getDate() + REFRESH_EXPIRATION)
        ),
        userId: user.id,
    })

    return res.json({
        type: "success",
        data: getToken(sessionToken, refreshToken),
    })
}

export const handleRefresh = async (
    req: Request<{ token: string }>,
    res: Response<{ session: string; refresh: string }>
) => {
    if (!req.body.token)
        return res.status(400).json({
            type: "error",
            message: "Token is required.",
        })

    let data: {
        token: string
        iat: number
    }
    try {
        data = jwt.verify(req.body.token, SIGNATURE) as {
            token: string
            iat: number
        }
    } catch (error) {
        return res.status(400).json({
            type: "error",
            message: "Token is unknown.",
        })
    }
    const access = await Access.findOne({
        where: { refresh: data.token },
    })
    if (!access)
        return res.status(400).json({
            type: "error",
            message: "Token is unknown.",
        })
    const userId = access.userId
    await access.destroy()

    const sessionToken = generateToken(50)
    const refreshToken = generateToken(50)
    await Access.create({
        refresh: refreshToken,
        session: sessionToken,
        expireAt: new Date(
            new Date().setDate(new Date().getDate() + REFRESH_EXPIRATION)
        ),
        userId,
    })

    return res.json({
        type: "success",
        data: getToken(sessionToken, refreshToken),
    })
}

export const handleMe = async (req: Request, res: Response<UserInterface>) => {
    res.json({
        type: "success",
        data: await userFormat(req.user!),
    })
}

export const handleEdit = async (
    req: Request<{
        firstname?: string
        lastname?: string
        email?: string
        phone?: string
        password?: string
    }>,
    res: Response<UserInterface>
) => {
    const errors = await editVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const user = req.user
    if (!user) return

    if (req.body.firstname) user.firstname = req.body.firstname
    if (req.body.lastname) user.lastname = req.body.lastname
    if (req.body.email) user.email = req.body.email
    if (req.body.phone) user.phone = req.body.phone
    if (req.body.password) user.password = hashSync(req.body.password, 10)

    await user.save()
    res.json({
        type: "success",
        data: await userFormat(user),
    })
}

export const handleSupport = async (
    req: Request<{
        object: string
        message: string
    }>,
    res: Response<string>
) => {
    const errors = await contactVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    await Contact.create({
        object: req.body.object,
        message: req.body.message,
        userId: req.user!.id,
    })

    res.json({ type: "success", data: "Message envoyé avec succès." })
}

export const handleLogout = async (req: Request, res: Response<string>) => {
    const bearer = req.headers.authorization
    const token = unsignToken(bearer?.replace("Bearer ", ""))
    if (!token)
        return res
            .status(400)
            .json({ type: "error", message: "Unknown error." })

    await Access.destroy({ where: { session: token } })
    res.json({
        type: "success",
        data: "Vous avez été déconnecté avec succès.",
    })
}

export const handleForget = async (
    req: Request<{ email: string }>,
    res: Response<string>
) => {
    const errors = await forgetVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user)
        return res.status(400).json({
            type: "error",
            message: "Cet email ne correspond à aucun compte.",
        })

    let reset = await Reset.findOne({
        where: {
            userId: user.id,
            createdAt: {
                [Op.gt]: new Date(new Date().getTime() - 60 * 1000),
            },
        },
    })
    if (reset)
        return res.status(400).json({
            type: "error",
            message: "Une demande a été faite il y a moins d'une minute.",
        })

    await Reset.destroy({
        where: {
            createdAt: {
                [Op.lt]: new Date(new Date().getTime() - 24 * 60 * 1000),
            },
        },
    })

    reset = await Reset.create({
        token: generateToken(32),
        userId: user.id,
    })

    sendEmail(
        user.email,
        "Réinitialisation de votre mot de passe",
        `Bonjour ${user.firstname}, <br>
        pour réinitialiser votre mot de passe veuillez cliquer <a href=${process.env.WEB_APP_URL}/reset/${reset.token}>ici</a>.`
    )

    res.json({ type: "success", data: "Un mail vient de vous être envoyé." })
}

export const verifyReset = async (
    req: Request<any, any, { token: string }>,
    res: Response<string>
) => {
    const reset = await Reset.findOne({
        where: {
            token: req.params.token,
            createdAt: {
                [Op.gte]: new Date(new Date().getTime() - 24 * 60 * 1000),
            },
        },
    })
    await Reset.destroy({
        where: {
            createdAt: {
                [Op.lt]: new Date(new Date().getTime() - 24 * 60 * 1000),
            },
        },
    })
    if (!reset)
        return res
            .status(400)
            .json({ type: "error", message: "Token non trouvé ou expiré." })

    res.json({
        type: "success",
        data: "Veuillez entrer votre nouveau mot de passe.",
    })
}

export const handleReset = async (
    req: Request<{ password: string }, any, { token: string }>,
    res: Response<{ session: string; refresh: string }>
) => {
    const errors = await resetVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const reset = await Reset.findOne({
        where: {
            token: req.params.token,
            createdAt: {
                [Op.gte]: new Date(new Date().getTime() - 24 * 60 * 1000),
            },
        },
    })
    if (!reset)
        return res
            .status(400)
            .json({ type: "error", message: "Token non trouvé ou expiré." })

    const user = await reset.getUser()
    user.password = hashSync(req.body.password, 10)
    await user.save()
    await Access.destroy({ where: { userId: user.id } })

    const sessionToken = generateToken(50)
    const refreshToken = generateToken(50)
    await Access.create({
        refresh: refreshToken,
        session: sessionToken,
        expireAt: new Date(
            new Date().setDate(new Date().getDate() + REFRESH_EXPIRATION)
        ),
        userId: user.id,
    })
    await reset.destroy()

    return res.json({
        type: "success",
        data: getToken(sessionToken, refreshToken),
    })
}
