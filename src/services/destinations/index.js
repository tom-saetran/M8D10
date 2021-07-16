import express from "express"
import mongoose from "mongoose"
const { isValidObjectId } = mongoose
import LocationModel from "./schema.js"
import createError from "http-errors"
import console from "console"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import { checkIfAdmin, checkIfHost } from "../../auth/admin.js"
import { LocationValidator } from "./validator.js"

const destinationsRouter = express.Router()

destinationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const response = await LocationModel.find()
        res.send(response)
    } catch (error) {
        next(createError(500, error))
    }
})

destinationsRouter.post("/", LocationValidator, JWTAuthMiddleware, checkIfAdmin, checkIfHost, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const result = new LocationModel(req.body)
            console.log(result)
            if (await result.save()) res.status(201).send(result)
            else next(createError(400, "Error saving data!"))
        } else next(createError(400, errors.mapped()))
    } catch (error) {
        next(createError(400, error))
    }
})

destinationsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await LocationModel.findById(req.params.id)

        if (!result) next(createError(404, `ID ${req.params.id} was not found`))
        else res.status(200).send(result)
    } catch (error) {
        console.log(error)
        next(error.message)
    }
})

destinationsRouter.put("/:id", JWTAuthMiddleware, checkIfAdmin, checkIfHost, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else
            result = await LocationModel.findByIdAndUpdate(
                req.params.id,
                { ...req.body, updatedAt: new Date() },
                { runValidators: true, new: true, useFindAndModify: false }
            )

        if (result) res.status(200).send(result)
        else next(createError(404, `ID ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

destinationsRouter.delete("/:id", JWTAuthMiddleware, checkIfAdmin, checkIfHost, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await LocationModel.findByIdAndDelete(req.params.id)

        if (result) res.status(204).send("Deleted")
        else next(createError(404, `ID ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

export default destinationsRouter
