import { Request, Response, NextFunction } from "express"
import { HttpError } from "http-errors"

type ErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => void

export const error400: ErrorHandler = (err, req, res, next) => {
    if (err.status === 400) res.status(400).send(err)
    else next(err)
}

export const unAuthorizedHandler: ErrorHandler = (err, req, res, next) => {
    if (err.status === 401) res.status(401).send(err.message || "You are not logged in!")
    else next(err)
}

export const forbiddenHandler: ErrorHandler = (err, req, res, next) => {
    if (err.status === 403) res.status(403).send(err.message || "You are not allowed to do that!")
    else next(err)
}

export const catchAllHandler: ErrorHandler = (err, req, res, next) => {
    res.status(500).send(err.message)
}
