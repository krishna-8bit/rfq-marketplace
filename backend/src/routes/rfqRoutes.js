import express from "express";

import {
  createRFQ,
  getMyRFQs,
  getAvailableRFQs,
  getRFQById,
  updateRFQ,
  deleteRFQ
} from "../controllers/rfqController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

import {
  createRFQValidator,
  updateRFQValidator
} from "../validators/rfqValidator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requireRole("buyer"),
  createRFQValidator,
  validationMiddleware,
  createRFQ
);

router.get(
  "/my",
  authMiddleware,
  requireRole("buyer"),
  getMyRFQs
);

router.get(
  "/",
  authMiddleware,
  requireRole("supplier"),
  getAvailableRFQs
);

router.get(
  "/:id",
  authMiddleware,
  getRFQById
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("buyer"),
  updateRFQValidator,
  validationMiddleware,
  updateRFQ
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("buyer"),
  deleteRFQ
);

export default router;