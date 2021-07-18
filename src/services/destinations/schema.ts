import mongoose, { Model } from "mongoose"
const { Schema, model } = mongoose
const destinationSchema = new Schema<BaseDestination, DestinationModel>(
    { city: { type: String, required: true, allowNull: false } },
    { timestamps: true }
)

export interface Destination {
    city: string
}

export interface BaseDestination extends Destination, Document {
    _id: string
    createdAt: string
    updatedAt: string
}

interface DestinationModel extends Model<BaseDestination> {}

export default model<BaseDestination, DestinationModel>("Destination", destinationSchema)
