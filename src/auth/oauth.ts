import passport from "passport"
import { Strategy } from "passport-google-oauth20"

import UserModel from "../services/users/schema"
import { JWTAuthenticate } from "./tools"

interface IProfile {
    name: {
        givenName: string
        familyName: string
    }
    emails: { value: string; type: string }[]
    id: string
}

const GoogleStrat = new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "/users/login/oauth/google/redirect"
    },
    async (accessToken, refreshToken, _profile, next) => {
        const profile = _profile as IProfile
        try {
            const user = await UserModel.findOne({ googleOAuth: profile.id })
            if (user) {
                const tokens = await JWTAuthenticate(user)
                next(null, { user, tokens })
            } else {
                const newUser = {
                    firstname: profile.name.givenName,
                    surname: profile.name.familyName,
                    email: profile.emails[0].value,
                    googleOAuth: profile.id
                }

                const createdUser = new UserModel(newUser)
                const savedUser = await createdUser.save()
                const tokens = await JWTAuthenticate(savedUser)
                next(null, { user: savedUser, tokens })
            }
        } catch (error) {
            next(error)
        }
    }
)

passport.use("google", GoogleStrat)

passport.serializeUser((user, next) => next(null, user))

export default {}
