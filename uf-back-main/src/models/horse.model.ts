import {
    Table,
    Model,
    AllowNull,
    Column,
    ForeignKey,
    HasMany,
} from "sequelize-typescript"
import { ModelAttribute } from "."
import Appointment from "./appointment.model"
import Reservation from "./reservation.model"
import User from "./user.model"

export interface HorseAttributes {
    id: number
    label: string
    birthAt: Date

    userId: number
}

@Table({
    modelName: "horse",
})
export default class Horse extends Model<
    ModelAttribute<HorseAttributes>,
    Omit<HorseAttributes, "id">
> {
    @AllowNull(false)
    @Column
    label!: string

    @AllowNull(false)
    @Column
    birthAt!: Date

    @ForeignKey(() => User)
    @Column
    userId!: number

    getUser = async (): Promise<User> =>
        (await User.findOne({ where: { id: this.userId } }))!

    @HasMany(() => Appointment, {
        onDelete: "CASCADE",
    })
    getAppointments = async (): Promise<Appointment[]> =>
        Appointment.findAll({ where: { horseId: this.id } })

    @HasMany(() => Reservation, {
        onDelete: "CASCADE",
    })
    getReservations = async (): Promise<Reservation[]> =>
        Reservation.findAll({ where: { horseId: this.id } })
}
