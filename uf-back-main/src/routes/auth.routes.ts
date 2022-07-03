import { Router } from "express"
import * as core from "express-serve-static-core"
import {
    handleEdit,
    handleForget,
    handleLogin,
    handleLogout,
    handleMe,
    handleRefresh,
    handleRegister,
    handleReset,
    handleSupport,
    verifyReset,
} from "../controllers/auth.controller"
import AuthMiddleware from "../middlewares/auth.middleware"

const authRoutes = (): core.Router => {
    const router: core.Router = Router()

    router.post("/auth/register", handleRegister)
    router.post("/auth/login", handleLogin)
    router.post("/auth/refresh", handleRefresh)
    router.post("/auth/forget", handleForget)
    router.get("/auth/reset/:token", verifyReset)
    router.post("/auth/reset/:token", handleReset)

    router.get("/auth/me", [AuthMiddleware], handleMe)
    router.patch("/auth/me", [AuthMiddleware], handleEdit)
    router.get("/auth/logout", [AuthMiddleware], handleLogout)
    router.post("/support", [AuthMiddleware], handleSupport)

    return router
}

export default authRoutes
