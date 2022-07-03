import * as express from "express"
import * as cookieParser from "cookie-parser"
import * as core from "express-serve-static-core"
import * as cors from "cors"
import * as http from "http"
import * as fileUpload from "express-fileupload"
import database from "./models"
import Role from "./models/role.model"
import { startPuppeteer } from "./utils/puppeteer"
import { startCron } from "./utils/cron"

type AppOption = {
    port?: number
    logging?: boolean
    developpment?: boolean
}

export default class App {
    public app: express.Application
    private routers: core.Router[]
    private server?: http.Server
    private port: number
    private developpment: boolean = false
    private logging: boolean = false

    constructor(routers: core.Router[], option?: AppOption) {
        this.port = option?.port || 8000
        this.developpment = option?.developpment ?? this.developpment
        this.logging = option?.logging ?? this.logging
        this.routers = routers
        this.app = express()
    }

    private async initializeDatabase() {
        await database.sync({ force: this.developpment })
        this.logging && console.log("Database connected!")
    }

    private initializeMiddlewares() {
        this.app.use(cookieParser())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
        this.app.use(
            cors({
                origin: "*",
            })
        )
        this.app.use(fileUpload())
    }

    private initializeRouter() {
        this.routers.map(router => this.app.use(router))
    }

    public async listen() {
        this.server = this.app.listen(
            this.port,
            () =>
                this.logging &&
                console.log(`Server listening on port ${this.port}!`)
        )

        await this.initializeDatabase()
        this.initializeMiddlewares()
        this.initializeRouter()

        await Role.findOrCreate({ where: { label: "USER" } })
        await Role.findOrCreate({ where: { label: "PROFESSIONAL" } })
        await Role.findOrCreate({ where: { label: "ADMINISTRATOR" } })

        await startPuppeteer()
        startCron()
    }

    public async close() {
        await new Promise(resolve => this.server?.close(resolve))
        await database.close()
    }
}
