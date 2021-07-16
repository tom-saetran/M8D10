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

import { Document, Model, model, Schema } from "mongoose"
import bcrypt from "bcrypt"

// Schema
const UserSchema = new Schema<User, UserModel>(
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

export interface User extends Document {
    firstname: string
    surname?: string
    email: string
    password?: string
    role: "Guest" | "Host" | "Admin"
    accommodations: Array<string>
    refreshToken?: string
    googleOAuth?: string
}

interface UserModel extends Model<User> {
    checkCredentials(email: string, plainPw: string): Promise<User>
}

UserSchema.statics.checkCredentials = async function (this: Model<User>, email: string, plainPw: string) {
    const user = await this.findOne({ email })
    if (user) {
        const hashedPw = user.password
        if (!hashedPw) return null
        const isMatch = await bcrypt.compare(plainPw, hashedPw)

        if (isMatch) return user
    }

    return null
}

UserSchema.pre<User>("save", async function (next) {
    const newUser = this
    const plainPw = newUser.password
    if (plainPw && this.isModified("password")) newUser.password = await bcrypt.hash(plainPw, 14)

    next()
})

export default model<User, UserModel>("User", UserSchema)
