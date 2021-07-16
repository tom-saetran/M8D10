import { NextFunction, Request, Response } from "express"
import createError from "http-errors"
import UserModel from "../services/users/schema"
import { verifyToken } from "./tools"

export const JWTAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.accessToken) next(createError(401, "No token provided"))
    else {
        try {
            const content = await verifyToken(req.cookies.accessToken)
            const user = await UserModel.findById(content._id)

            if (user) {
                req.user = user && next()
                next()
            } else next(createError(404, "User not found"))
        } catch (error) {
            next(createError(401, "Token is invalid"))
        }
    }
}
