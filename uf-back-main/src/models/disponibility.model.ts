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
import UserJob from "./user.job.model"
import User from "./user.model"

export interface DisponibilityAttributes {
    id: number
    beginAt: Date
    endAt: Date

    userJobId: number
}

@Table({
    modelName: "disponibility",
})
export default class Disponibility extends Model<
    ModelAttribute<DisponibilityAttributes>,
    Omit<DisponibilityAttributes, "id">
> {
    @AllowNull(false)
    @Column
    beginAt!: Date

    @AllowNull(false)
    @Column
    endAt!: Date

    @ForeignKey(() => UserJob)
    @Column
    userJobId!: number

    getUser = async (): Promise<User> =>
        (await UserJob.findOne({ where: { id: this.userJobId } }).then(uj =>
            uj?.getUser()
        ))!

    @HasMany(() => Appointment, {
        onDelete: "CASCADE",
    })
    getAppointments = async (): Promise<Appointment[]> =>
        Appointment.findAll({ where: { disponibilityId: this.id } })
}
