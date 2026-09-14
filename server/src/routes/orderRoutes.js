import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId, validatePagination } from "../middleware/validation.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createOrder);

router
  .route("/my")
  .get(protect, validatePagination, getMyOrders);

router
  .route("/:id")
  .get(protect, validateObjectId, getOrderById);

export default router;