import { Request, Response } from "../../@types/express"
import { HorseInterface } from "../interfaces/admin.interface"
import Horse from "../models/horse.model"
import User from "../models/user.model"
import {
    createHorseVerification,
    editHorseVerification,
} from "../utils/verifications/horse.verification"
import { userFormat } from "./admin.controller"

export const horseFormat = async (horse: Horse): Promise<HorseInterface> => {
    const user = await horse.getUser().then(userFormat)

    return {
        id: horse.id,
        label: horse.label,
        birthAt: horse.birthAt,
        createdAt: horse.createdAt,
        updatedAt: horse.deletedAt,
        user,
    }
}

export const myHorseList = async (
    req: Request,
    res: Response<HorseInterface[]>
) => {
    const horses = await req
        .user!.getHorses()
        .then(horses => Promise.all(horses.map(horseFormat)))

    res.status(200).json({ type: "success", data: horses })
}

export const horseList = async (
    req: Request,
    res: Response<HorseInterface[]>
) => {
    const horses = await Horse.findAll().then(horses =>
        Promise.all(horses.map(horseFormat))
    )

    res.status(200).json({ type: "success", data: horses })
}

export const horseUserList = async (
    req: Request<any, any, { id: string }>,
    res: Response<HorseInterface[]>
) => {
    const user = await User.findByPk(req.params.id)
    if (!user)
        return res
            .status(400)
            .json({ type: "error", message: "User not found." })

    const horses = await user
        .getHorses()
        .then(horses => Promise.all(horses.map(horseFormat)))

    res.status(200).json({ type: "success", data: horses })
}

export const horseDetail = async (
    req: Request,
    res: Response<HorseInterface>
) => {
    const horse = await Horse.findByPk(req.params.id)
    if (!horse)
        return res
            .status(400)
            .json({ type: "error", message: "Horse not found." })

    res.status(200).json({
        type: "success",
        data: await horseFormat(horse),
    })
}

export const horseCreate = async (
    req: Request<{
        user: number
        label: string
        birth: Date
    }>,
    res: Response<HorseInterface>
) => {
    const errors = await createHorseVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const horse = await Horse.create({
        userId: req.body.user,
        label: req.body.label,
        birthAt: new Date(req.body.birth),
    }).then(horseFormat)

    res.status(200).json({ type: "success", data: horse })
}

export const horseDelete = async (
    req: Request<any, unknown, { id: string }>,
    res: Response<string>
) => {
    const horse = await Horse.findByPk(req.params.id)
    if (!horse)
        return res
            .status(400)
            .json({ type: "error", message: "Horse not found." })

    await horse.destroy()

    res.status(200).json({
        type: "success",
        data: "Cheval supprimé avec succès.",
    })
}

export const horseEdit = async (
    req: Request<
        {
            user?: number
            label?: string
            birth?: Date
        },
        any,
        { id: string }
    >,
    res: Response<HorseInterface>
) => {
    const errors = await editHorseVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const horse = await Horse.findByPk(req.params.id)
    if (!horse)
        return res
            .status(400)
            .json({ type: "error", message: "Horse not found." })

    if (req.body.user) horse.userId = req.body.user
    if (req.body.birth) horse.birthAt = req.body.birth
    if (req.body.label) horse.label = req.body.label

    await horse.save()
    res.status(200).json({
        type: "success",
        data: await horseFormat(horse),
    })
}
