import { NextFunction } from "express"
import { Request, Response } from "../../@types/express"
import { getUser } from "../utils/auth.utils"

const AdminMiddleware = async (
    req: Request,
    res: Response<any>,
    next: NextFunction
): Promise<any> => {
    const user = await getUser(req)
    if (!user)
        return res.status(401).json({ type: "error", message: "Unauthorized" })

    req.user = user
    const role = await user.getRole()
    if (role.label !== "ADMINISTRATOR")
        return res
            .status(403)
            .json({ type: "error", message: "Forbidden, administrator" })
    next()
}

export default AdminMiddleware
