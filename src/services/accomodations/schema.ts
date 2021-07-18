import mongoose, { Model } from "mongoose"
import { BaseDestination } from "../destinations/schema"
import { BaseUser } from "../users/schema"

const { Schema, model } = mongoose

const AccommodationSchema = new Schema<BaseAccommodations, AccommodationsModel>(
    {
        name: { type: String, required: true, allowNull: false },
        description: { type: String, required: true, allowNull: false },
        destination: { type: Schema.Types.ObjectId, ref: "Destination", required: true, allowNull: false },
        host: { type: Schema.Types.ObjectId, ref: "User", required: true, allowNull: false },
        maxGuests: { type: Number, required: true, allowNull: false }
    },
    { timestamps: true }
)

export interface Accommodations {
    name: string
    description: string
    destination: BaseDestination["_id"]
    host: BaseUser["_id"]
    maxGuests: number
}

export interface BaseAccommodations extends Accommodations, Document {
    _id: string
    createdAt: string
    updatedAt: string
}

interface AccommodationsModel extends Model<BaseAccommodations> {}

AccommodationSchema.methods.toJSON = function () {
    const schema = this
    const object = schema.toObject()
    delete object.__v

    return object
}

export default model<BaseAccommodations, AccommodationsModel>("Accommodation", AccommodationSchema)
