import {
    Table,
    Model,
    AllowNull,
    Column,
    HasMany,
    DataType,
} from "sequelize-typescript"
import { ModelAttribute } from "."
import UserJob from "./user.job.model"
import User from "./user.model"

export interface JobAttributes {
    id: number
    label: string
    price: number
}

@Table({
    modelName: "job",
})
export default class Job extends Model<
    ModelAttribute<JobAttributes>,
    Omit<JobAttributes, "id">
> {
    @AllowNull(false)
    @Column
    label!: string

    @AllowNull(false)
    @Column(DataType.FLOAT)
    price!: number

    @HasMany(() => UserJob, {
        onDelete: "CASCADE",
    })
    getUsers = async (): Promise<User[]> =>
        UserJob.findAll({ where: { jobId: this.id } }).then(userJobs =>
            Promise.all(
                userJobs.map(
                    async userJob => (await User.findByPk(userJob.userId))!
                )
            )
        )

    addUser = async (user: User) => {
        await UserJob.findOrCreate({
            where: { jobId: this.id, userId: user.id },
        })
    }

    removeUser = async (user: User) => {
        await UserJob.destroy({ where: { jobId: this.id, userId: user.id } })
    }
}
