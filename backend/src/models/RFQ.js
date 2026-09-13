import mongoose from "mongoose";

const rfqSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    productName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    deliveryLocation: {
      type: String,
      required: true,
      trim: true
    },

    deadline: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

const RFQ = mongoose.model("RFQ", rfqSchema);

export default RFQ;