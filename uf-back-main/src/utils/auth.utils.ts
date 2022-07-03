import { Request } from "express"
import * as jwt from "jsonwebtoken"
import Access from "../models/access.model"
import User from "../models/user.model"

export const SIGNATURE = "CSTSSJKXDOKJS6YD4SO6H3TF6VCXNNBK"
export const REFRESH_EXPIRATION = 14 // Days

export const getUser = async (req: Request): Promise<User | null> => {
    if (!req.headers.authorization) return null
    try {
        const data = jwt.verify(
            req.headers.authorization.replace("Bearer ", ""),
            SIGNATURE
        ) as { token: string; iat: number }
        const access = await Access.findOne({ where: { session: data.token } })
        if (!access) return null
        return await access.getUser()
    } catch (error) {
        return null
    }
}
