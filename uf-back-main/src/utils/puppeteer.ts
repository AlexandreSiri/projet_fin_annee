import * as puppeteer from "puppeteer"
import * as ejs from "ejs"
import * as fs from "fs"
import path = require("path")
import { AppointmentInterface } from "../interfaces/admin.interface"
import { formatDateInvoice, formatDateMonthInvoice } from "./date"
import User from "../models/user.model"
import { nanoid } from "nanoid"

let browser: puppeteer.Browser

export const startPuppeteer = async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
        ],
    })
}

export const generateInvoicePDF = async (
    u: User,
    date: Date,
    appointments: AppointmentInterface[]
) => {
    const products = appointments.map(appointment => ({
        horse: appointment.horse.label,
        activity: appointment.disponibility.job.label,
        professional: `${
            appointment.disponibility.user.firstname
        } ${appointment.disponibility.user.lastname.toUpperCase()}`,
        date: formatDateInvoice(appointment.date),
        price: appointment.disponibility.job.price,
    }))
    const total = products.reduce((r, p) => r + p.price, 0)
    const user = {
        name: `${u.firstname} ${u.lastname.toUpperCase()}`,
        email: u.email,
    }

    const page = await browser.newPage()
    const string = await ejs.renderFile(
        path.join(__dirname, "../templates/invoice.ejs"),
        {
            appointments: products,
            total,
            user,
            created: formatDateInvoice(new Date()),
            date: formatDateMonthInvoice(date),
        }
    )
    await page.setContent(string)
    if (!fs.existsSync(path.join(__dirname, "../../public")))
        fs.mkdirSync(path.join(__dirname, "../../public"))

    const file = `${nanoid()}.pdf`
    await page.pdf({
        path: path.join(__dirname, "../../public", file),
    })
    return file
}
