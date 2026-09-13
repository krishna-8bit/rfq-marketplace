import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    rfq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFQ",
      required: true
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    quotedPrice: {
      type: Number,
      required: true,
      min: 0
    },

    estimatedDeliveryTime: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

quotationSchema.index(
  { rfq: 1, supplier: 1 },
  { unique: true }
);

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;