import q2m from "query-to-mongo"
import express from "express"
import createError from "http-errors"
import BlogModel from "./schema.js"
import UserModel from "../users/schema.js"
import mongoose from "mongoose"
const { isValidObjectId } = mongoose
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import { checkIfHost, checkPostEditPrivileges } from "../../auth/admin.js"

const accommodationsRouter = express.Router()

const mongoOptions = {
    runValidators: true,
    new: true,
    useFindAndModify: false
}

accommodationsRouter.post("/", JWTAuthMiddleware, checkIfHost, async (req, res, next) => {
    try {
        const entry = new BlogModel(req.body)

        if (await entry.save()) {
            if (await UserModel.findByIdAndUpdate(entry.author, { $push: { blogs: entry._id } }, mongoOptions)) res.status(201).send(entry._id)
            else next(createError(400, "Author ID is invalid"))
        } else next(createError(500, "Error saving data"))
    } catch (error) {
        next(error)
    }
})

accommodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const total = await BlogModel.countDocuments(query.criteria)
        const limit = 100
        const result = await BlogModel.find(query.criteria)
            .sort(query.options.sort)
            .skip(query.options.skip || 0)
            .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)
            .populate("authors")
        res.status(200).send({ links: query.links("/blogs", total), total, result })
    } catch (error) {
        next(error)
    }
})

accommodationsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await BlogModel.findById(req.params.id).populate("authors")

        if (result) res.status(200).send(result)
        else next(createError(404, `ID ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

accommodationsRouter.delete("/:id", JWTAuthMiddleware, checkIfHost, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await BlogModel.findById(req.params.id)

        if (result) {
            await userModel.findByIdAndUpdate(result.author, { $pull: { blogs: req.params.id } }, { timestamps: false, useFindAndModify: false })

            result.remove()
            res.send("Deleted")
        } else next(createError(404, `ID ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

accommodationsRouter.put("/:id", JWTAuthMiddleware, checkIfHost, async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID ${req.params.id} is invalid`))
        else result = await BlogModel.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, mongoOptions)

        if (result) res.status(200).send(result)
        else next(createError(404, `ID ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

export default accommodationsRouter
