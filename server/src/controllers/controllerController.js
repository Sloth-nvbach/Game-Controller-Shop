import asyncHandler from "../middleware/asyncHandler.js";
import Controller from "../models/Controller.js";

// @desc    Get all controllers
// @route   GET /api/controllers
// @access  Public
const getControllers = asyncHandler(async (req, res) => {
  const controllers = await Controller.find();
  res.json(controllers);
});

// @desc    Get a single controller by id
// @route   GET /api/controllers/:id
// @access  Public
const getControllerById = asyncHandler(async (req, res) => {
  const controller = await Controller.findById(req.params.id);

  if (controller) {
    res.json(controller);
  } else {
    res.status(404);
    throw new Error("Controller not found");
  }
});

// @desc    Create a controller
// @route   POST /api/controllers
// @access  Public (admin/auth later)
const createController = asyncHandler(async (req, res) => {
  const controller = await Controller.create(req.body);
  res.status(201).json(controller);
});

// @desc    Update a controller
// @route   PUT /api/controllers/:id
// @access  Public (admin/auth later)
const updateController = asyncHandler(async (req, res) => {
  const controller = await Controller.findById(req.params.id);

  if (!controller) {
    res.status(404);
    throw new Error("Controller not found");
  }

  const updated = await Controller.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// @desc    Delete a controller
// @route   DELETE /api/controllers/:id
// @access  Public (admin/auth later)
const deleteController = asyncHandler(async (req, res) => {
  const controller = await Controller.findById(req.params.id);

  if (!controller) {
    res.status(404);
    throw new Error("Controller not found");
  }

  await controller.deleteOne();
  res.json({ message: "Controller removed" });
});

export {
  getControllers,
  getControllerById,
  createController,
  updateController,
  deleteController,
};