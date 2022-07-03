import { Table, Model, AllowNull, Column, HasMany } from "sequelize-typescript"
import { ModelAttribute } from "."
import Reservation from "./reservation.model"

export interface LocationAttributes {
    id: number
    label: string
}

@Table({
    modelName: "location",
})
export default class Location extends Model<
    ModelAttribute<LocationAttributes>,
    Omit<LocationAttributes, "id">
> {
    @AllowNull(false)
    @Column
    label!: string

    @HasMany(() => Reservation, {
        onDelete: "CASCADE",
    })
    getReservations = async (): Promise<Reservation[]> =>
        Reservation.findAll({ where: { locationId: this.id } })
}
