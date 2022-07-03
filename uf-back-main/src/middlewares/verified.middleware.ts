import { NextFunction } from "express"
import { Request, Response } from "../../@types/express"
import { getUser } from "../utils/auth.utils"

const VerifiedMiddleware = async (
    req: Request,
    res: Response<any>,
    next: NextFunction
): Promise<any> => {
    const user = await getUser(req)
    if (!user?.validated)
        return res
            .status(403)
            .json({ type: "error", message: "Forbidden, verified" })

    req.user = user
    next()
}

export default VerifiedMiddleware
