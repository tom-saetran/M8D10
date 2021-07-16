import mongoose from "mongoose"

const { Schema, model } = mongoose

const AccommodationSchema = new Schema(
    {
        name: { type: String, required: true, allowNull: false },
        description: { type: String, required: true, allowNull: false },
        location: { type: Schema.Types.ObjectId, ref: "Location", required: true, allowNull: false },
        host: { type: Schema.Types.ObjectId, ref: "Users", required: true, allowNull: false },
        maxGuests: { type: Number, required: true, allowNull: false }
    },
    { timestamps: true }
)

AccommodationSchema.methods.toJSON = function () {
    const schema = this
    const object = schema.toObject()
    delete object.__v

    return object
}

export default model("Accommodation", AccommodationSchema)
