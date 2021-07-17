import supertest from "supertest"
import server from "../server"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { IAccommodation } from "../services/accomodations/schema"
import { ILocation } from "../services/destinations/schema"
import { User, BaseUser } from "../services/users/schema"
dotenv.config()
const request = supertest(server)
const { MONGO_CONNECTION } = process.env

var accessToken: string
var refreshToken: string
var user: BaseUser

// describe("", () => {})
// it("should..", () => {})
// expect().toBe()

beforeAll(() => mongoose.connect(MONGO_CONNECTION!, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }))
afterAll(done => mongoose.connection.dropDatabase(() => mongoose.connection.close(() => done())))

describe("Shared behaviour between all user roles", () => {
    describe("POST /users/register", () => {
        const validRegister: User = {
            firstname: "Test",
            surname: "User",
            email: "test@mail.com",
            password: "1234Test!",
            role: "Guest"
        }

        const invalidRegister = {
            firstname: "Test",
            email: "test@email.com",
            password: "1234Test!",
            role: false,
            accommodations: []
        }

        it("should return 400 with missing registration data", async () => {
            const response = await request.post("/users/register")
            expect(response.status).toBe(400)
        })

        it("should return 400 with invalid registration data", async () => {
            const response = await request.post("/users/register").send(invalidRegister)
            expect(response.status).toBe(400)
        })

        it("should return 302 with valid registration data", async () => {
            const response = await request.post("/users/register").send(validRegister)
            accessToken = response.header["set-cookie"][0].split(";")[0]
            refreshToken = response.header["set-cookie"][1].split(";")[0]

            expect(response.status).toBe(302)
            expect(accessToken).toBeDefined()
            expect(refreshToken).toBeDefined()
        })
    })

    describe("GET /users/me", () => {
        it("should return 400 without any cookies", async () => {
            const response = await request.get("/users/me")
            expect(response.status).toBe(400)
        })

        it("should return 403 with an invalid cookie", async () => {
            const response = await request.get("/users/me").set("Cookie", [`accessToken=HelloWorld`])
            expect(response.status).toBe(403)
        })

        it("should return 200 with a valid cookie", async () => {
            const response = await request.get("/users/me").set("Cookie", [accessToken])
            user = response.body
            console.log(user)
            expect(response.status).toBe(200)
        })
    })

    describe("PUT /users/me", () => {
        const validEdit = {
            firstname: "Megatron",
            surname: "9000",
            email: "test@mail.com"
        }
        const invalidEdit = {
            firstname: "Megatron",
            surname: "9000",
            email: true
        }

        it("should return 400 without any cookies", async () => {
            const response = await request.put("/users/me")
            expect(response.status).toBe(400)
        })

        it("should return 403 with an invalid cookie", async () => {
            const response = await request.put("/users/me").set("Cookie", [`accessToken=HelloWorld`])
            expect(response.status).toBe(403)
        })

        it("should return 400 with a valid cookie, but without any payload", async () => {
            const response = await request.put("/users/me").set("Cookie", [accessToken])
            expect(response.status).toBe(400)
        })

        it("should return 400 with a valid cookie, but with an invalid payload", async () => {
            const response = await request.put("/users/me").set("Cookie", [accessToken]).send(invalidEdit)
            expect(response.status).toBe(400)
        })

        it("should return 200 with a valid cookie, and with a valid payload", async () => {
            const response = await request.put("/users/me").set("Cookie", [accessToken]).send(validEdit)
            expect(response.status).toBe(200)
        })
    })

    describe("DELETE /users/me", () => {
        it("should return 400 without any cookies", async () => {
            const response = await request.get("/users/me")
            expect(response.status).toBe(400)
        })

        it("should return 403 with an invalid cookie", async () => {
            const response = await request.get("/users/me").set("Cookie", [`accessToken=HelloWorld`])
            expect(response.status).toBe(403)
        })

        it("should return 200 with a valid cookie", async () => {
            const response = await request.get("/users/me").set("Cookie", [accessToken])
            expect(response.status).toBe(200)
        })
    })
})
