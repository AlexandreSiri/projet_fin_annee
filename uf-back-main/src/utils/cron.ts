import { job } from "cron"
import { generateInvoice } from "../controllers/admin.controller"
import User from "../models/user.model"

const cronFunction = async () => {
    const users = await User.findAll()
    await Promise.all(
        users.map(async user => {
            generateInvoice(user, new Date(), true)
        })
    )
}

export const startCron = () => {
    const cronJob = job("0 0 1 * *", cronFunction, null, true, "Europe/Paris")
    cronJob.start()
}
