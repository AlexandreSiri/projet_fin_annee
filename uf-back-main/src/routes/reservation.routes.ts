import { Router } from "express"
import * as core from "express-serve-static-core"
import AuthMiddleware from "../middlewares/auth.middleware"
import AdminMiddleware from "../middlewares/admin.middleware"
import {
    locationDelete,
    locationCreate,
    locationList,
    myReservationCreate,
    myReservationDelete,
    myReservationList,
    reservationDelete,
    reservationList,
    userReservationList,
    locationDetail,
} from "../controllers/reservation.controller"

const reservationRoutes = (): core.Router => {
    const router: core.Router = Router()

    // Auth
    // Location
    router.get("/locations", [AuthMiddleware], locationList)
    router.get("/locations/:id", [AuthMiddleware], locationDetail)

    // Reservation
    router.get("/reservations", [AuthMiddleware], myReservationList)
    router.post("/reservations", [AuthMiddleware], myReservationCreate)
    router.delete("/reservations/:id", [AuthMiddleware], myReservationDelete)

    // Admin
    // Location
    router.post("/admin/locations", [AdminMiddleware], locationCreate)
    router.delete("/admin/locations/:id", [AdminMiddleware], locationDelete)

    // Reservation
    router.get("/admin/reservations", [AdminMiddleware], reservationList)
    router.get(
        "/admin/users/:id/reservations",
        [AdminMiddleware],
        userReservationList
    )
    router.delete(
        "/admin/reservations/:id",
        [AdminMiddleware],
        reservationDelete
    )

    return router
}

export default reservationRoutes
