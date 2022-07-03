import { Router } from "express"
import * as core from "express-serve-static-core"
import {
    userList,
    userValidate,
    userDelete,
    userEdit,
    userDetail,
    roleList,
    userGenerateInvoice,
    supportList,
    supportDelete,
} from "../controllers/admin.controller"
import AdminMiddleware from "../middlewares/admin.middleware"

const adminRoutes = (): core.Router => {
    const router: core.Router = Router()

    router.get("/admin/roles", [AdminMiddleware], roleList)
    router.get("/admin/users", [AdminMiddleware], userList)
    router.get("/admin/supports", [AdminMiddleware], supportList)
    router.delete("/admin/supports/:id", [AdminMiddleware], supportDelete)
    router.get("/admin/users/:id", [AdminMiddleware], userDetail)
    router.patch("/admin/users/:id", [AdminMiddleware], userEdit)
    router.delete("/admin/users/:id", [AdminMiddleware], userDelete)
    router.post("/admin/users/:id/validate", [AdminMiddleware], userValidate)
    router.post(
        "/admin/users/:id/invoices",
        [AdminMiddleware],
        userGenerateInvoice
    )

    return router
}

export default adminRoutes
