import RFQ from "../models/RFQ.js";

export const createRFQ = async (req, res, next) => {
  try {
    const {
      productName,
      description,
      quantity,
      deliveryLocation,
      deadline
    } = req.body;

    const rfq = await RFQ.create({
      buyer: req.user.id,
      productName,
      description,
      quantity,
      deliveryLocation,
      deadline
    });

    res.status(201).json({
      message: "RFQ created successfully",
      rfq
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRFQs = async (req, res, next) => {
  try {
    const rfqs = await RFQ.find({
      buyer: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      rfqs
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableRFQs = async (
  req,
  res,
  next
) => {
  try {
    const { search, location } = req.query;

    const query = {
      status: "open",
      deadline: {
        $gt: new Date()
      }
    };

    if (search) {
      query.productName = {
        $regex: search,
        $options: "i"
      };
    }

    if (location) {
      query.deliveryLocation = {
        $regex: location,
        $options: "i"
      };
    }

    const rfqs = await RFQ.find(query)
      .populate("buyer", "name")
      .sort({ deadline: 1 });

    res.status(200).json({
      rfqs
    });
  } catch (error) {
    next(error);
  }
};

export const getRFQById = async (req, res, next) => {
  try {
    const rfq = await RFQ.findById(
      req.params.id
    ).populate("buyer", "name email");

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found"
      });
    }

    res.status(200).json({
      rfq
    });
  } catch (error) {
    next(error);
  }
};

export const updateRFQ = async (
  req,
  res,
  next
) => {
  try {
    const rfq = await RFQ.findById(
      req.params.id
    );

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
          "You can only update your own RFQs"
      });
    }

    if (rfq.status !== "open") {
      return res.status(400).json({
        message:
          "Closed RFQs cannot be updated"
      });
    }

    if (
      new Date(rfq.deadline) <= new Date()
    ) {
      return res.status(400).json({
        message:
          "Expired RFQs cannot be updated"
      });
    }

    Object.assign(rfq, req.body);

    await rfq.save();

    res.status(200).json({
      message: "RFQ updated successfully",
      rfq
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRFQ = async (
  req,
  res,
  next
) => {
  try {
    const rfq = await RFQ.findById(
      req.params.id
    );

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
          "You can only delete your own RFQs"
      });
    }

    if (
      rfq.status !== "open"
    ) {
      return res.status(400).json({
        message:
          "Closed RFQs cannot be deleted"
      });
    }

    if (
      new Date(rfq.deadline) <= new Date()
    ) {
      return res.status(400).json({
        message:
          "Expired RFQs cannot be deleted"
      });
    }

    await rfq.deleteOne();

    res.status(200).json({
      message: "RFQ deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};