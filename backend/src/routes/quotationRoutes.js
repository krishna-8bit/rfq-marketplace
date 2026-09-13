import express from "express";

import {
  createQuotation,
  getRFQQuotations,
  getMyQuotations,
  updateQuotation
} from "../controllers/quotationController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

import {
  createQuotationValidator,
  updateQuotationValidator
} from "../validators/quotationValidator.js";

const router = express.Router();

router.post(
  "/rfqs/:rfqId/quotations",
  authMiddleware,
  requireRole("supplier"),
  createQuotationValidator,
  validationMiddleware,
  createQuotation
);

router.get(
  "/rfqs/:rfqId/quotations",
  authMiddleware,
  requireRole("buyer"),
  getRFQQuotations
);

router.get(
  "/quotations/my",
  authMiddleware,
  requireRole("supplier"),
  getMyQuotations
);

router.put(
  "/quotations/:id",
  authMiddleware,
  requireRole("supplier"),
  updateQuotationValidator,
  validationMiddleware,
  updateQuotation
);

export default router;