import * as core from "express-serve-static-core"
import { Router } from "express"
import {
    horseList,
    horseCreate,
    horseDelete,
    horseEdit,
    horseDetail,
    myHorseList,
    horseUserList,
} from "../controllers/horse.controller"
import AdminMiddleware from "../middlewares/admin.middleware"
import AuthMiddleware from "../middlewares/auth.middleware"

const horseRoutes = (): core.Router => {
    const router: core.Router = Router()

    // Auth
    router.get("/horses", [AuthMiddleware], myHorseList)

    // Admin
    router.get("/admin/horses", [AdminMiddleware], horseList)
    router.post("/admin/horses", [AdminMiddleware], horseCreate)
    router.get("/admin/users/:id/horses", [AdminMiddleware], horseUserList)
    router.get("/admin/horses/:id", [AdminMiddleware], horseDetail)
    router.delete("/admin/horses/:id", [AdminMiddleware], horseDelete)
    router.patch("/admin/horses/:id", [AdminMiddleware], horseEdit)

    return router
}

export default horseRoutes
