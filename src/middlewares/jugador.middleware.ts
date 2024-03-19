import { body } from "express-validator";

export const jugadorCadenaValidacion = [
  body("userName")
    .exists({ checkFalsy: true })
    .withMessage("User name is required")
    .isString()
    .withMessage("User name should be string"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  body("email").optional().isEmail().withMessage("Provide valid email"),
  body("gender")
    .optional()
    .isString()
    .withMessage("Gender should be string")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender value is invalid"),
  body("dateOfBirth")
    .optional()
    .isDate()
    .withMessage("DOB should be valid date"),
  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("phone number should be string")
    .custom((value) => {
      if (value.length !== 10) {
        return Promise.reject("Phone number should be 10 digits");
      } else {
        return true;
      }
    }),
];
