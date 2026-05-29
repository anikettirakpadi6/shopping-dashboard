import mongoose, { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const PaymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["mock", "razorpay", "cod"],
      default: "mock",
    },

    transactionId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [OrderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    payment: {
      method: {
        type: String,
      },

      transactionId: {
        type: String,
      },

      paidAt: {
        type: Date,
      },
    },

    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;