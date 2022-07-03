import { Router } from "express"
import * as express from "express"
import * as core from "express-serve-static-core"
import path = require("path")

const cdnRoutes = (): core.Router => {
    const router: core.Router = Router()

    router.use("/cdn", express.static(path.join(__dirname, "../../public")))

    return router
}

export default cdnRoutes
