import {
    Table,
    Model,
    AllowNull,
    Column,
    ForeignKey,
} from "sequelize-typescript"
import { ModelAttribute } from "."
import Disponibility from "./disponibility.model"
import Horse from "./horse.model"

export interface AppointmentAttributes {
    id: number
    date: Date

    horseId: number
    disponibilityId: number
}

@Table({
    modelName: "appointment",
})
export default class Appointment extends Model<
    ModelAttribute<AppointmentAttributes>,
    Omit<AppointmentAttributes, "id">
> {
    @AllowNull(false)
    @Column
    date!: Date

    @ForeignKey(() => Horse)
    @Column
    horseId!: number

    getHorse = async (): Promise<Horse> =>
        (await Horse.findOne({ where: { id: this.horseId } }))!

    @ForeignKey(() => Disponibility)
    @Column
    disponibilityId!: number

    getDisponibility = async (): Promise<Disponibility> =>
        (await Disponibility.findOne({ where: { id: this.disponibilityId } }))!
}
