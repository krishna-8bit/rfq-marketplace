import mongoose from "mongoose";

import Quotation from "../models/Quotation.js";
import RFQ from "../models/RFQ.js";

export const createQuotation = async (
  req,
  res,
  next
) => {
  try {
    const { rfqId } = req.params;

    const {
      quotedPrice,
      estimatedDeliveryTime,
      message
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(rfqId)
    ) {
      return res.status(400).json({
        message: "Invalid RFQ ID"
      });
    }

    const rfq = await RFQ.findById(rfqId);

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found"
      });
    }

    if (rfq.status !== "open") {
      return res.status(400).json({
        message:
          "This RFQ is no longer open"
      });
    }

    if (
      new Date(rfq.deadline) <= new Date()
    ) {
      return res.status(400).json({
        message:
          "The deadline for this RFQ has passed"
      });
    }

    const existingQuotation =
      await Quotation.findOne({
        rfq: rfqId,
        supplier: req.user.id
      });

    if (existingQuotation) {
      return res.status(409).json({
        message:
          "You have already submitted a quotation for this RFQ"
      });
    }

    const quotation = await Quotation.create({
      rfq: rfqId,
      supplier: req.user.id,
      quotedPrice,
      estimatedDeliveryTime,
      message
    });

    res.status(201).json({
      message:
        "Quotation submitted successfully",
      quotation
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already submitted a quotation for this RFQ"
      });
    }

    next(error);
  }
};

export const getRFQQuotations = async (
  req,
  res,
  next
) => {
  try {
    const { rfqId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(rfqId)
    ) {
      return res.status(400).json({
        message: "Invalid RFQ ID"
      });
    }

    const rfq = await RFQ.findById(rfqId);

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found"
      });
    }

    if (
      rfq.buyer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only view quotations for your own RFQs"
      });
    }

    const quotations =
      await Quotation.find({
        rfq: rfqId
      })
        .populate(
          "supplier",
          "name email"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      quotations
    });
  } catch (error) {
    next(error);
  }
};

export const getMyQuotations = async (
  req,
  res,
  next
) => {
  try {
    const quotations =
      await Quotation.find({
        supplier: req.user.id
      })
        .populate(
          "rfq",
          "productName quantity deliveryLocation deadline status"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      quotations
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuotation = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid quotation ID"
      });
    }

    const quotation =
      await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found"
      });
    }

    if (
      quotation.supplier.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own quotations"
      });
    }

    const rfq = await RFQ.findById(
      quotation.rfq
    );

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found"
      });
    }

    if (rfq.status !== "open") {
      return res.status(400).json({
        message:
          "Quotations cannot be edited for a closed RFQ"
      });
    }

    if (
      new Date(rfq.deadline) <= new Date()
    ) {
      return res.status(400).json({
        message:
          "The deadline for this RFQ has passed"
      });
    }

    const {
      quotedPrice,
      estimatedDeliveryTime,
      message
    } = req.body;

    if (quotedPrice !== undefined) {
      quotation.quotedPrice =
        quotedPrice;
    }

    if (
      estimatedDeliveryTime !== undefined
    ) {
      quotation.estimatedDeliveryTime =
        estimatedDeliveryTime;
    }

    if (message !== undefined) {
      quotation.message = message;
    }

    await quotation.save();

    res.status(200).json({
      message:
        "Quotation updated successfully",
      quotation
    });
  } catch (error) {
    next(error);
  }
};