import { Request } from "express"
import Horse from "../../models/horse.model"
import Location from "../../models/location.model"
import Reservation from "../../models/reservation.model"

export const createLocationVerification = async (
    req: Request
): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.label) errors.push("Le label est obligatoire.")
    else if (req.body.label.length < 2)
        errors.push("Le label doit contenir au minimum 2 caractères.")
    else if (req.body.label.length > 32)
        errors.push("Le label doit contenir au maximum 32 caractères.")
    else if (await Location.findOne({ where: { label: req.body.label } }))
        errors.push("Une location possède déjà ce label.")

    return errors
}

export const createReservationVerification = async (
    req: Request
): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.location) return ["La location est obligatoire."]
    const location = await Location.findByPk(req.body.location)
    if (!location) return ["Location not found."]
    else req.body.location = parseInt(req.body.location)

    if (!req.body.date) errors.push("La date de départ est obligatoire.")
    else if (isNaN((req.body.date = new Date(req.body.date)).getTime()))
        errors.push("La date doit être au bon format.")
    else if (req.body.date.getTime() % (3600 * 1000))
        errors.push("La date doit être une heure pile.")

    if (errors.length) return errors

    if (await Reservation.findOne({ where: { date: req.body.date } }))
        errors.push("Un rendez-vous est déjà pris sur ce créneau.")

    if (!req.body.horse) errors.push("Le cheval est obligatoire.")
    else {
        const horse = await Horse.findByPk(req.body.horse)
        if (!horse) errors.push("Horse not found.")
        else if (horse.userId !== req.user?.id)
            errors.push("User doesn't own this horse.")
        else req.body.horse = parseInt(req.body.horse)
    }

    return errors
}
