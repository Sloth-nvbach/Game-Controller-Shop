import mongoose from "mongoose";

const controllerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    compatibility: { type: [String], default: [] },
    image: { type: String, default: "" },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Controller = mongoose.model("Controller", controllerSchema);

export default Controller;