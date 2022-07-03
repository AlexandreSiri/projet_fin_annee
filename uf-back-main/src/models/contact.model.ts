import {
    Table,
    Model,
    AllowNull,
    Column,
    ForeignKey,
    DataType,
} from "sequelize-typescript"
import { ModelAttribute } from "."
import User from "./user.model"

export interface ContactAttributes {
    id: number
    object: string
    message: string

    userId: number
}

@Table({
    modelName: "contact",
})
export default class Contact extends Model<
    ModelAttribute<ContactAttributes>,
    Omit<ContactAttributes, "id">
> {
    @AllowNull(false)
    @Column
    object!: string

    @AllowNull(false)
    @Column(DataType.TEXT)
    message!: string

    @ForeignKey(() => User)
    @Column
    userId!: number

    getUser = async (): Promise<User> =>
        (await User.findOne({ where: { id: this.userId } }))!
}
