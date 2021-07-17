import createError from "http-errors"
import AccommodationModel from "../services/accomodations/schema"
import { Request, Response, NextFunction } from "express"
import { BaseUser } from "../services/users/schema"

type Route = (req: Request, res: Response, next: NextFunction) => void

export const checkIfAdmin: Route = (req, res, next) => {
    const user = req.user as BaseUser
    if (user.role === "Admin") next()
    else next(createError(403))
}

export const checkUserEditPrivileges: Route = (req, res, next) => {
    const user = req.user as BaseUser
    if (user.role === "Admin" || user._id === req.params.id) next()
    else next(createError(403))
}

export const checkAccommodationEditPrivileges: Route = async (req, res, next) => {
    const user = req.user as BaseUser
    const { host } = await AccommodationModel.findById(req.params.id)
    if (host.id === user._id) next()
    if (user.role === "Admin") next()
    else next(createError(403))
}

export const checkIfHost: Route = (req, res, next) => {
    const user = req.user as BaseUser
    if (user.role === "Host") next()
    else next(createError(403))
}
