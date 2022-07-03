import { Request, Response } from "../../@types/express"
import {
    LocationInterface,
    ReservationInterface,
} from "../interfaces/admin.interface"
import Horse from "../models/horse.model"
import Location from "../models/location.model"
import Reservation from "../models/reservation.model"
import {
    createLocationVerification,
    createReservationVerification,
} from "../utils/verifications/reservation.verification"
import { horseFormat } from "./horse.controller"

export const locationFormat = async (
    location: Location
): Promise<LocationInterface> => ({
    id: location.id,
    label: location.label,
    used: await location
        .getReservations()
        .then(reservations => reservations.map(r => r.date)),
    createdAt: location.createdAt,
    updatedAt: location.updatedAt,
})
export const reservationFormat = async (
    reservation: Reservation
): Promise<ReservationInterface> => ({
    id: reservation.id,
    date: reservation.date,
    horse: await reservation.getHorse().then(horseFormat),
    location: await reservation.getLocation().then(locationFormat),
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
})

// Location
export const locationList = async (
    req: Request,
    res: Response<LocationInterface[]>
) => {
    const locations = await Location.findAll().then(locations =>
        Promise.all(locations.map(locationFormat))
    )
    res.json({ type: "success", data: locations })
}
export const locationDetail = async (
    req: Request<any, any, { id: string }>,
    res: Response<LocationInterface>
) => {
    const location = await Location.findByPk(req.params.id)
    if (!location)
        return res
            .status(400)
            .json({ type: "error", message: "Location not found." })

    res.json({ type: "success", data: await locationFormat(location) })
}
export const locationCreate = async (
    req: Request<{ label: string }>,
    res: Response<LocationInterface>
) => {
    const errors = await createLocationVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const location = await Location.create({ label: req.body.label })

    res.json({ type: "success", data: await locationFormat(location) })
}
export const locationDelete = async (
    req: Request<any, any, { id: string }>,
    res: Response<string>
) => {
    const location = await Location.findByPk(req.params.id)
    if (!location)
        return res
            .status(400)
            .json({ type: "error", message: "Location not found." })

    await location.destroy()
    res.json({ type: "success", data: "Location supprimé avec succès." })
}

// Reservation
export const reservationList = async (
    req: Request,
    res: Response<ReservationInterface[]>
) => {
    const reservations = await Reservation.findAll().then(reservations =>
        Promise.all(reservations.map(reservationFormat))
    )

    res.json({
        type: "success",
        data: reservations,
    })
}

export const myReservationList = async (
    req: Request,
    res: Response<ReservationInterface[]>
) => {
    const reservations = await Horse.findAll({
        where: { userId: req.user!.id },
    })
        .then(horses =>
            Promise.all(horses.map(horse => horse.getReservations()))
        )
        .then(reservations =>
            Promise.all(reservations.flat().map(reservationFormat))
        )

    res.json({ type: "success", data: reservations })
}

export const userReservationList = async (
    req: Request<any, any, { id: string }>,
    res: Response<ReservationInterface[]>
) => {
    const reservations = await Horse.findAll({
        where: { userId: req.params.id },
    })
        .then(horses =>
            Promise.all(horses.map(horse => horse.getReservations()))
        )
        .then(reservations =>
            Promise.all(reservations.flat().map(reservationFormat))
        )

    res.json({ type: "success", data: reservations })
}

export const myReservationCreate = async (
    req: Request<{
        date: Date
        horse: number
        location: number
    }>,
    res: Response<ReservationInterface>
) => {
    const errors = await createReservationVerification(req)
    if (errors.length)
        return res.status(400).json({ type: "error", message: errors[0] })

    const reservation = await Reservation.create({
        date: req.body.date,
        horseId: req.body.horse,
        locationId: req.body.location,
    }).then(reservationFormat)

    res.json({ type: "success", data: reservation })
}
export const myReservationDelete = async (
    req: Request<any, any, { id: string }>,
    res: Response<string>
) => {
    const reservation = await Reservation.findByPk(req.params.id)
    if (!reservation)
        return res
            .status(400)
            .json({ type: "error", message: "Reservation not found." })

    if (
        await reservation
            .getHorse()
            .then(horse => horse.userId !== req.user?.id)
    )
        return res.status(400).json({
            type: "error",
            message: "User doesn't own this reservation.",
        })

    await reservation.destroy()
    res.json({ type: "success", data: "Reservation supprimée avec succès." })
}

export const reservationDelete = async (
    req: Request<any, any, { id: string }>,
    res: Response<string>
) => {
    const reservation = await Reservation.findByPk(req.params.id)
    if (!reservation)
        return res
            .status(400)
            .json({ type: "error", message: "Reservation not found." })

    await reservation.destroy()
    res.json({ type: "success", data: "Reservation supprimée avec succès." })
}
