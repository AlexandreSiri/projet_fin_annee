import * as core from "express-serve-static-core"
import { Router } from "express"
import AdminMiddleware from "../middlewares/admin.middleware"
import {
    jobCreate,
    jobDelete,
    jobEdit,
    jobList,
} from "../controllers/job.controller"
import AuthMiddleware from "../middlewares/auth.middleware"

const jobRoutes = (): core.Router => {
    const router: core.Router = Router()

    // Auth
    router.get("/jobs", [AuthMiddleware], jobList)

    // Admin
    router.post("/admin/jobs", [AdminMiddleware], jobCreate)
    router.patch("/admin/jobs/:id", [AdminMiddleware], jobEdit)
    router.delete("/admin/jobs/:id", [AdminMiddleware], jobDelete)

    return router
}

export default jobRoutes
