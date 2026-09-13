// Controller model - represents a game controller product in the shop
import mongoose from "mongoose";

const controllerSchema = new mongoose.Schema(
  {
    // Product name, e.g. "DualSense Wireless Controller"
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Brand of the controller, e.g. "Sony", "Microsoft", "Nintendo"
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    // Price in USD
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Short description of the controller
    description: {
      type: String,
      default: "",
    },

    // Platforms the controller works with, e.g. ["PC", "PS5"]
    compatibility: {
      type: [String],
      default: [],
    },

    // Connection type: "Wireless", "Wired", or "Both"
    connection: {
      type: String,
      enum: ["Wireless", "Wired", "Both"],
      default: "Wireless",
    },

    // URL of the product image
    image: {
      type: String,
      default: "",
    },

    // How many items are left in stock
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Average customer rating (0 - 5 stars)
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

const Controller = mongoose.model("Controller", controllerSchema);

export default Controller;
