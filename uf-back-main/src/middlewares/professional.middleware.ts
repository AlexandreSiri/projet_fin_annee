import { NextFunction, Request, Response } from "express"
import { getUser } from "../utils/auth.utils"

const ProfessionalMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    const user = await getUser(req)
    if (!user)
        return res.status(401).json({ type: "error", message: "Unauthorized" })

    req.user = user
    const role = await user.getRole()
    if (role.label !== "PROFESSIONAL" && role.label !== "ADMINISTRATOR")
        return res
            .status(403)
            .json({ type: "error", message: "Forbidden, professional" })
    next()
}

export default ProfessionalMiddleware
