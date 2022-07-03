import {
    Table,
    Model,
    AllowNull,
    Column,
    ForeignKey,
} from "sequelize-typescript"
import { ModelAttribute } from "."
import User from "./user.model"

export interface ResetAttributes {
    id: number
    token: string

    userId: number
}

@Table({
    modelName: "reset",
})
export default class Reset extends Model<
    ModelAttribute<ResetAttributes>,
    Omit<ResetAttributes, "id">
> {
    @AllowNull(false)
    @Column
    token!: string

    @ForeignKey(() => User)
    @Column
    userId!: number

    getUser = async (): Promise<User> =>
        (await User.findOne({ where: { id: this.userId } }))!
}
