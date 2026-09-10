import express from "express";
import {
  getControllers,
  getControllerById,
  createController,
  updateController,
  deleteController,
} from "../controllers/controllerController.js";

const router = express.Router();

router.route("/").get(getControllers).post(createController);
router
  .route("/:id")
  .get(getControllerById)
  .put(updateController)
  .delete(deleteController);

export default router;