import {
    Table,
    Model,
    AllowNull,
    Column,
    ForeignKey,
} from "sequelize-typescript"
import { ModelAttribute } from "."
import Horse from "./horse.model"
import Location from "./location.model"

export interface ReservationAttributes {
    id: number
    date: Date

    horseId: number
    locationId: number
}

@Table({
    modelName: "reservation",
})
export default class Reservation extends Model<
    ModelAttribute<ReservationAttributes>,
    Omit<ReservationAttributes, "id">
> {
    @AllowNull(false)
    @Column
    date!: Date

    @ForeignKey(() => Horse)
    @Column
    horseId!: number

    getHorse = async (): Promise<Horse> =>
        (await Horse.findOne({ where: { id: this.horseId } }))!

    @ForeignKey(() => Location)
    @Column
    locationId!: number

    getLocation = async (): Promise<Location> =>
        (await Location.findOne({ where: { id: this.locationId } }))!
}
