import {
    Table,
    Model,
    AllowNull,
    Column,
    HasMany,
    ForeignKey,
} from "sequelize-typescript"
import { ModelAttribute } from "."
import Access from "./access.model"
import Contact from "./contact.model"
import Horse from "./horse.model"
import Job from "./job.model"
import Role from "./role.model"
import UserJob from "./user.job.model"

export interface UserAttributes {
    id: number
    firstname: string
    lastname: string
    email: string
    phone?: string
    password: string
    validated: boolean

    roleId: number
}

@Table({
    modelName: "user",
})
export default class User extends Model<
    ModelAttribute<UserAttributes>,
    Omit<UserAttributes, "id">
> {
    @AllowNull(false)
    @Column
    firstname!: string

    @AllowNull(false)
    @Column
    lastname!: string

    @AllowNull(false)
    @Column
    email!: string

    @AllowNull(true)
    @Column
    phone!: string

    @AllowNull(false)
    @Column
    password!: string

    @AllowNull(false)
    @Column
    validated!: boolean

    @ForeignKey(() => Role)
    @Column
    roleId!: number

    getRole = async (): Promise<Role> =>
        (await Role.findOne({ where: { id: this.roleId } }))!

    @HasMany(() => Access, {
        onDelete: "CASCADE",
    })
    getAccesses = async (): Promise<Access[]> =>
        Access.findAll({ where: { userId: this.id } })

    @HasMany(() => Contact, {
        onDelete: "CASCADE",
    })
    getContacts = async (): Promise<Contact[]> =>
        Contact.findAll({ where: { userId: this.id } })

    @HasMany(() => Horse, {
        onDelete: "CASCADE",
    })
    getHorses = async (): Promise<Horse[]> =>
        Horse.findAll({ where: { userId: this.id } })

    @HasMany(() => UserJob, {
        onDelete: "CASCADE",
    })
    getJobs = async (): Promise<Job[]> =>
        UserJob.findAll({ where: { userId: this.id } }).then(userJobs =>
            Promise.all(
                userJobs.map(
                    async userJob => (await Job.findByPk(userJob.jobId))!
                )
            )
        )

    addJob = async (job: Job) => {
        await UserJob.findOrCreate({
            where: { jobId: job.id, userId: this.id },
        })
    }

    removeJob = async (job: Job) => {
        await UserJob.destroy({ where: { jobId: job.id, userId: this.id } })
    }

    removeJobs = async () => {
        await UserJob.destroy({ where: { userId: this.id } })
    }
}
