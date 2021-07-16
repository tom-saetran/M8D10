export interface User {
    _id: string
    firstname: string
    surname: string
    email: string
    password?: string
    role: "Guest" | "Host" | "Admin"
    accommodations: [string] | []
    refreshToken?: string
    googleOAuth?: string
    __v?: 0
}

export interface EnvironmentVariables {
    PORT: string
    MONGO_CONNECTION: string
    JWT_SECRET: string
    JWT_REFRESH_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
}
