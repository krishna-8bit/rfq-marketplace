import { body } from "express-validator";

export const createQuotationValidator = [
  body("quotedPrice")
    .isFloat({ min: 0 })
    .withMessage("Quoted price must be 0 or greater"),

  body("estimatedDeliveryTime")
    .trim()
    .notEmpty()
    .withMessage("Estimated delivery time is required"),

  body("message")
    .optional()
    .trim()
];

export const updateQuotationValidator = [
  body("quotedPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Quoted price must be 0 or greater"),

  body("estimatedDeliveryTime")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Estimated delivery time is required"),

  body("message")
    .optional()
    .trim()
];

export default {
  createQuotationValidator,
  updateQuotationValidator
};