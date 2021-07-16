import createError from "http-errors"
import AccommodationModel from "../services/accomodations/schema.js"

export const checkIfAdmin = (req, res, next) => {
    if (req.user.role === "Admin") next()
    else next(createError(403))
}

export const checkUserEditPrivileges = (req, res, next) => {
    if (req.user.role === "Admin" || req.user._id === req.params.id) next()
    else next(createError(403))
}

export const checkAccommodationEditPrivileges = async (req, res, next) => {
    const { host } = await AccommodationModel.findById(req.params.id)
    if (host.id === req.user._id) next()
    if (req.user.role === "Admin") next()
    else next(createError(403))
}

export const checkIfHost = (req, res, next) => {
    if (req.user.role === "Host") next()
    else next(createError(403))
}
