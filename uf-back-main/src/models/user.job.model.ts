import { Table, Model, Column, ForeignKey, HasMany } from "sequelize-typescript"
import { ModelAttribute } from "."
import Disponibility from "./disponibility.model"
import Job from "./job.model"
import User from "./user.model"

export interface UserJobAttributes {
    id: number

    userId: number
    jobId: number
}

@Table({
    modelName: "user_job",
})
export default class UserJob extends Model<
    ModelAttribute<UserJobAttributes>,
    Omit<UserJobAttributes, "id">
> {
    @ForeignKey(() => User)
    @Column
    userId!: number

    @ForeignKey(() => Job)
    @Column
    jobId!: number

    getUser = async (): Promise<User> =>
        (await User.findOne({ where: { id: this.userId } }))!

    getJob = async (): Promise<Job> =>
        (await Job.findOne({ where: { id: this.jobId } }))!

    @HasMany(() => Disponibility, {
        onDelete: "CASCADE",
    })
    getDisponibilities = async () =>
        Disponibility.findAll({ where: { userJobId: this.id } })
}
