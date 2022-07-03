import { Request as Req, Response as Res } from "express"
import * as core from "express-serve-static-core"
import User from "../../src/models/user.model"

export interface Request<
    ReqBody = any,
    ReqQuery = any,
    P = core.ParamsDictionary,
    ResBody = any
> extends Req<P, ResBody, ReqBody, ReqQuery> {}
export interface Response<T = unknown>
    extends Res<
        { type: "success"; data: T } | { type: "error"; message: string }
    > {}

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}
