import jwt from "jsonwebtoken"
import UserModel, { User } from "../services/users/schema"

process.env.TS_NODE_DEV && require("dotenv").config()

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env
if (!JWT_SECRET || !JWT_REFRESH_SECRET) throw new Error("Environment variables unreachable.")

export const JWTAuthenticate = async (user: User) => {
    const accessToken = (await generateJWT({ _id: user._id })) as string
    const refreshToken = (await generateRefreshJWT({ _id: user._id })) as string
    user.refreshToken = refreshToken
    await user.save()
    return { accessToken, refreshToken }
}

const generateJWT = (payload: object) =>
    new Promise((resolve, reject) => jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }, (err, token) => (err ? reject(err) : resolve(token))))

const generateRefreshJWT = (payload: object) =>
    new Promise((resolve, reject) => jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "1 week" }, (err, token) => (err ? reject(err) : resolve(token))))

export const verifyToken = (token: string) =>
    new Promise((resolve, reject) => jwt.verify(token, JWT_SECRET, (err, decodedToken) => (err ? reject(err) : resolve(decodedToken))))

const verifyRefreshToken = (token: string) =>
    new Promise((resolve, reject) => jwt.verify(token, JWT_REFRESH_SECRET, (err, decodedToken) => (err ? reject(err) : resolve(decodedToken))))

export const refreshTokens = async (actualRefreshToken: string) => {
    const content = (await verifyRefreshToken(actualRefreshToken)) as User
    const user = await UserModel.findById(content._id)

    if (!user) throw new Error("User not found")
    if (user.refreshToken === actualRefreshToken) {
        const newAccessToken = (await generateJWT({ _id: user._id })) as string
        const newRefreshToken = (await generateRefreshJWT({ _id: user._id })) as string
        user.refreshToken = newRefreshToken
        await user.save()
        return { newAccessToken, newRefreshToken }
    } else throw new Error("Refresh Token not valid")
}
