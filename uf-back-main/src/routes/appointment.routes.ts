import { Router } from "express"
import * as core from "express-serve-static-core"
import AuthMiddleware from "../middlewares/auth.middleware"
import AdminMiddleware from "../middlewares/admin.middleware"
import {
    appointmentDelete,
    appointmentList,
    disponibilityCreate,
    disponibilityDelete,
    disponibilityList,
    jobDisponibilityList,
    myAppointmentCreate,
    myAppointmentDelete,
    myAppointmentList,
    professionalAppointmentList,
    professionalDisponibilityList,
    userAppointmentList,
    userDisponibilityList,
} from "../controllers/appointment.controller"
import ProfessionalMiddleware from "../middlewares/professional.middleware"

const appointmentRoutes = (): core.Router => {
    const router: core.Router = Router()

    // Auth
    // Disponibility
    router.get(
        "/jobs/:id/disponibilities",
        [AuthMiddleware],
        jobDisponibilityList
    )
    // Appointment
    router.get("/appointments", [AuthMiddleware], myAppointmentList)
    router.post("/appointments", [AuthMiddleware], myAppointmentCreate)
    router.delete("/appointments/:id", [AuthMiddleware], myAppointmentDelete)

    // Professional
    router.get(
        "/professional/appointments",
        [ProfessionalMiddleware],
        professionalAppointmentList
    )
    router.get(
        "/professional/disponibilities",
        [ProfessionalMiddleware],
        professionalDisponibilityList
    )

    // Admin
    // Disponibility
    router.get("/admin/disponibilities", [AdminMiddleware], disponibilityList)
    router.get(
        "/admin/users/:id/disponibilities",
        [AdminMiddleware],
        userDisponibilityList
    )
    router.post(
        "/admin/disponibilities",
        [AdminMiddleware],
        disponibilityCreate
    )
    router.delete(
        "/admin/disponibilities/:id",
        [AdminMiddleware],
        disponibilityDelete
    )

    // Appointment
    router.get("/admin/appointments", [AdminMiddleware], appointmentList)
    router.get(
        "/admin/users/:id/appointments",
        [AdminMiddleware],
        userAppointmentList
    )
    router.delete(
        "/admin/appointments/:id",
        [AdminMiddleware],
        appointmentDelete
    )

    return router
}

export default appointmentRoutes
