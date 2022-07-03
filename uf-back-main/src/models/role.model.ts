import { Table, Model, AllowNull, Column, HasMany } from "sequelize-typescript"
import { ModelAttribute } from "."
import User from "./user.model"

export interface RoleAttributes {
    id: number
    label: "ADMINISTRATOR" | "PROFESSIONAL" | "USER"
}

@Table({
    modelName: "role",
})
export default class Role extends Model<
    ModelAttribute<RoleAttributes>,
    Omit<RoleAttributes, "id">
> {
    @AllowNull(false)
    @Column
    label!: "ADMINISTRATOR" | "PROFESSIONAL" | "USER"

    @HasMany(() => User, {
        onDelete: "CASCADE",
    })
    getUsers = async (): Promise<User[]> =>
        User.findAll({ where: { roleId: this.id } })
}
