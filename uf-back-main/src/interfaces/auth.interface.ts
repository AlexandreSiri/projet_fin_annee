import { UserAttributes } from "../models/user.model"

export type UserCreationAttribute = Omit<
    UserAttributes,
    "id" | "verificationAt"
>

export type Token = {
    session: string
    refresh: string
}
