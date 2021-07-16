import { body } from "express-validator"

export const LocationValidator = [body("city").exists().withMessage("City is a mandatory field")]
