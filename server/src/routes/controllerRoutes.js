import express from "express";
import {
  getControllers,
  getControllerById,
  createController,
  updateController,
  deleteController,
} from "../controllers/controllerController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { 
  validateCreateController, 
  validateUpdateController, 
  validateObjectId,
  validatePagination 
} from "../middleware/validation.js";

const router = express.Router();

router
  .route("/")
  .get(validatePagination, getControllers)
  .post(protect, adminOnly, validateCreateController, createController);

router
  .route("/:id")
  .get(validateObjectId, getControllerById)
  .put(protect, adminOnly, validateUpdateController, updateController)
  .delete(protect, adminOnly, validateObjectId, deleteController);

export default router;