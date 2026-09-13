import { body } from "express-validator";

export const createRFQValidator = [
  body("productName")
    .trim()
    .notEmpty()
    .withMessage("Product or service name is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Requirement description is required"),

  body("quantity")
    .isFloat({ min: 1 })
    .withMessage("Quantity must be greater than 0"),

  body("deliveryLocation")
    .trim()
    .notEmpty()
    .withMessage("Delivery location is required"),

  body("deadline")
    .isISO8601()
    .withMessage("Valid deadline is required")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Deadline must be in the future");
      }

      return true;
    })
];

export const updateRFQValidator = [
  body("productName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product or service name cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("quantity")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Quantity must be greater than 0"),

  body("deliveryLocation")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Delivery location cannot be empty"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Valid deadline is required")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Deadline must be in the future");
      }

      return true;
    })
];