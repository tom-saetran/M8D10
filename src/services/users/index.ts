import q2m from "query-to-mongo"
import express, { Request, Response, NextFunction } from "express"
import passport from "passport"
import Model, { User } from "./schema"
import createError from "http-errors"
import { validationResult } from "express-validator"
import mongoose from "mongoose"
const { isValidObjectId } = mongoose
import { JWTAuthMiddleware } from "../../auth/middlewares"
import { checkIfHost, checkUserEditPrivileges } from "../../auth/admin"
import { LoginValidator, UserValidator } from "./validator"
import { refreshTokens, JWTAuthenticate } from "../../auth/tools"

const usersRouter = express.Router()

usersRouter.post("/register", UserValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const entry = new Model(req.body)
            const result = await entry.save()
            res.status(201).send({ id: result._id, role: result.role })
        } else next(createError(400, errors.mapped()))
    } catch (error) {
        next(error)
    }
})

interface ITokens {
    accessToken: string
    refreshToken: string
}

usersRouter.post("/login", LoginValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const { email, password } = req.body
            const tokens = req.user as ITokens
            const user = await Model.checkCredentials(email, password)

            if (user) {
                const { accessToken, refreshToken } = await JWTAuthenticate(user)

                res.cookie("accessToken", tokens.accessToken, { httpOnly: true /*sameSite: "lax", secure: true*/ })
                res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true /*sameSite: "lax", secure: true*/ })
                res.status(200).redirect("http://localhost:666/")
            } else next(createError(401, "Wrong credentials provided"))
        } else next(createError(400, errors.mapped()))
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/login/oauth/google/login", passport.authenticate("google", { scope: ["profile", "email"] }))
usersRouter.get("/login/oauth/google/redirect", passport.authenticate("google"), async (req, res, next) => {
    try {
        const tokens = req.user as ITokens
        res.cookie("accessToken", tokens.accessToken, { httpOnly: true /*sameSite: "lax", secure: true*/ })
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true /*sameSite: "lax", secure: true*/ })
        res.status(200).redirect("http://localhost:666/")
    } catch (error) {
        next(error)
    }
})

usersRouter.post("/logout", JWTAuthMiddleware, async (req, res, next) => {
    try {
        let user = req.user as User
        user.refreshToken = undefined
        await user.save()
        res.status(205).send("Logged out")
    } catch (error) {
        next(error)
    }
})

usersRouter.post("/refreshToken", async (req, res, next) => {
    try {
        if (!req.body.refreshToken) next(createError(400, "Refresh Token not provided"))
        else {
            const { newAccessToken, newRefreshToken } = await refreshTokens(req.body.refreshToken)
            res.send({ newAccessToken, newRefreshToken })
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const total = await Model.countDocuments(query.criteria)
        const limit = 25
        const result = await Model.find(query.criteria)
            .sort(query.options.sort)
            .skip(query.options.skip || 0)
            .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)

        res.status(200).send({ links: query.links("/users", total), total, result })
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/me/accommodations", JWTAuthMiddleware, checkIfHost, async (req, res, next) => {
    try {
        const user = req.user as User
        const result = await Model.findById(user._id).populate("accommodations")
        res.status(200).send(result!.accommodations)
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const user = req.user as User
        await user.deleteOne()
        res.status(205).send("User terminated")
    } catch (error) {
        next(error)
    }
})

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        let user = req.user as User
        req.body.name ? (user.firstname = req.body.name) : null
        req.body.surname ? (user.surname = req.body.surname) : null
        req.body.email ? (user.email = req.body.email) : null

        const result = await user.save()

        res.status(200).send(result)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:id", async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else {
            const result = await Model.findById(req.params.id)
            if (!result) next(createError(404, `ID ${req.params.id} was not found`))
            else res.status(200).send(result)
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:id/accommodations", JWTAuthMiddleware, checkIfHost, async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else {
            const result = await Model.findById(req.params.id).populate("accommodations")
            if (!result) next(createError(404, `ID ${req.params.id} was not found`))
            else res.status(200).send(result.accommodations)
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/:id", JWTAuthMiddleware, checkUserEditPrivileges, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await Model.findByIdAndDelete(req.params.id, { useFindAndModify: false })

        if (result) res.status(200).send("User Terminated")
        else next(createError(404, `ID ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

usersRouter.put("/:id", JWTAuthMiddleware, checkUserEditPrivileges, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await Model.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true, useFindAndModify: false })

        if (!result) next(createError(404, `ID ${req.params.id} was not found`))
        else res.status(200).send(result)
    } catch (error) {
        next(error)
    }
})

export default usersRouter
