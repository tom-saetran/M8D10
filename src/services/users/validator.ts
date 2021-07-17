import { body } from "express-validator"

export const UserValidator = [
    body("firstname").exists().isString().withMessage("Firstname is a mandatory field"),
    body("surname").exists().isString().withMessage("Surname is a mandatory field"),
    body("email")
        .exists()
        .isEmail()
        .normalizeEmail()
        .isLength({ max: 50 })
        .withMessage("Email is a mandatory field")
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email"),
    body("password").exists().isStrongPassword().withMessage("Password is a mandatory field and needs to be strong")
]

export const UserEditValidator = [
    body("firstname").exists().withMessage("Firstname is a mandatory field"),
    body("surname").exists().withMessage("Surname is a mandatory field"),
    body("email").exists().isLength({ max: 50 }).withMessage("Email is a mandatory field").isEmail().normalizeEmail().withMessage("Invalid email")
]

export const LoginValidator = [
    body("email").exists().withMessage("Email is a mandatory field").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").exists().withMessage("Password is a mandatory field")
]
