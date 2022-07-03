import { Sequelize } from "sequelize-typescript"
import Access from "./access.model"
import Appointment from "./appointment.model"
import Contact from "./contact.model"
import Disponibility from "./disponibility.model"
import Horse from "./horse.model"
import Job from "./job.model"
import Location from "./location.model"
import Reservation from "./reservation.model"
import Reset from "./reset.model"
import Role from "./role.model"
import UserJob from "./user.job.model"
import User from "./user.model"

export type ModelAttribute<Attribute> = Attribute & {
    createdAt?: Date
    updatedAt?: Date
    destroyedAt?: Date
}

const sequelize = new Sequelize({
    dialect: "mysql",
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    logging: false,
})

sequelize.addModels([
    User,
    Role,
    Access,
    Reset,
    Horse,
    Job,
    UserJob,
    Disponibility,
    Appointment,
    Location,
    Reservation,
    Contact,
])

export default sequelize
