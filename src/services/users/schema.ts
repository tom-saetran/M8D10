/*import { Document, Schema, model, Model } from "mongoose"
import bcrypt from "bcrypt"

interface User {
    firstName: string
    surname: string
    email: string
    password?: string
    role: "Guest" | "Host" | "Admin"
    accommodations: Array<string>
    refreshToken?: string
    googleOAuth?: string
}

interface IMongoUser extends User, Document {
    createdAt: string
    editedAt: string
    _id: string
    __v?: 0
}

export interface IUser extends IMongoUser {
    checkCredentials(email: string, plainPw: string): Promise<IMongoUser>
}

const UserSchema = new Schema<IMongoUser, Model<IUser>>(
    {
        firstname: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: { type: String, required: true, enum: ["Host", "Guest"], default: "Guest" },
        accommodations: [{ type: Schema.Types.ObjectId, ref: "Accommodation", required: true }],
        refreshToken: { type: String },
        googleOAuth: { type: String }
    },
    { timestamps: true }
)
*/

import { Date, Document, Model, model, Schema } from "mongoose"
import bcrypt from "bcrypt"
import { hashPassword } from "../../auth/tools"

// Schema
const UserSchema = new Schema<BaseUser, UserModel>(
    {
        firstname: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: { type: String, required: true, enum: ["Host", "Guest"], default: "Guest" },
        accommodations: [{ type: Schema.Types.ObjectId, ref: "Accommodation", default: [] }],
        refreshToken: { type: String },
        googleOAuth: { type: String }
    },
    { timestamps: true }
)

export interface User {
    firstname: string
    surname: string
    email: string
    password?: string
    role: "Guest" | "Host" | "Admin"
    accommodations?: Array<string>
    refreshToken?: string
    googleOAuth?: string
}

export interface BaseUser extends User, Document {
    _id: string
    createdAt: string
    updatedAt: string
}

interface UserModel extends Model<BaseUser> {
    checkCredentials(email: string, plainPw: string): Promise<BaseUser>
}

UserSchema.methods.toJSON = function () {
    const schema = this
    const object = schema.toObject()

    delete object.password
    delete object.__v

    return object
}

UserSchema.statics.checkCredentials = async function (this: Model<BaseUser>, email: string, plainPw: string) {
    const user = await this.findOne({ email })
    if (user) {
        const hashedPw = user.password
        if (!hashedPw) return null
        const isMatch = await bcrypt.compare(plainPw, hashedPw)

        if (isMatch) return user
    }

    return null
}

UserSchema.pre<BaseUser>("save", async function (next) {
    const newUser = this
    const plaintextPassword = newUser.password
    if (plaintextPassword && this.isModified("password")) newUser.password = await hashPassword(plaintextPassword)

    next()
})

export default model<BaseUser, UserModel>("User", UserSchema)
