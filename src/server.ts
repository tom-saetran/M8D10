import cors from "cors"
import express from "express"
import passport from "passport"
import oauth from "./auth/oauth"
import cookieParser from "cookie-parser"
import listEndpoints from "express-list-endpoints"
import usersRoutes from "./services/users"
import accommodationsRoutes from "./services/accomodations"
import destinationsRoutes from "./services/destinations"
import { unAuthorizedHandler, forbiddenHandler, catchAllHandler, error400 } from "./errorHandlers"

const server = express()
const port = process.env.PORT || 3001

// MIDDLEWARES
server.use(cors({ origin: "localhost", credentials: true }))
server.use(express.json())
server.use(cookieParser())
server.use(passport.initialize())

// ROUTES
server.use("/users", usersRoutes)
server.use("/accommodations", accommodationsRoutes)
server.use("/destinations", destinationsRoutes)

// ERROR HANDLERS
server.use(error400)
server.use(unAuthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

console.table(listEndpoints(server))

export default server
