import {
    Table,
    Model,
    AllowNull,
    Column,
    ForeignKey,
} from "sequelize-typescript"
import { ModelAttribute } from "."
import User from "./user.model"

export interface AccessAttributes {
    id: number
    session: string
    refresh: string
    expireAt: Date

    userId: number
}

@Table({
    modelName: "access",
})
export default class Access extends Model<
    ModelAttribute<AccessAttributes>,
    Omit<AccessAttributes, "id">
> {
    @AllowNull(false)
    @Column
    session!: string

    @AllowNull(false)
    @Column
    refresh!: string

    @ForeignKey(() => User)
    @Column
    userId!: number

    getUser = async (): Promise<User> =>
        (await User.findOne({ where: { id: this.userId } }))!
}
