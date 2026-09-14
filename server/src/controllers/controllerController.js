import asyncHandler from "../middleware/asyncHandler.js";
import Controller from "../models/Controller.js";

// @desc    Get all controllers with pagination, search, filter
// @route   GET /api/controllers
// @access  Public
const getControllers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const brand = req.query.brand || "";
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
  const connection = req.query.connection || "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  // Build filter
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (brand) {
    filter.brand = brand;
  }

  if (connection) {
    filter.connection = connection;
  }

  filter.price = { $gte: minPrice, $lte: maxPrice };

  // Build sort
  const sort = { [sortBy]: sortOrder };

  const [controllers, total] = await Promise.all([
    Controller.find(filter).sort(sort).skip(skip).limit(limit),
    Controller.countDocuments(filter),
  ]);

  res.json({
    controllers,
    page,
    pages: Math.ceil(total / limit),
    total,
    hasMore: page * limit < total,
  });
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
    throw new Error("Không tìm thấy sản phẩm");
  }
});

// @desc    Create a controller
// @route   POST /api/controllers
// @access  Private/Admin
const createController = asyncHandler(async (req, res) => {
  const controller = await Controller.create(req.body);
  res.status(201).json(controller);
});

// @desc    Update a controller
// @route   PUT /api/controllers/:id
// @access  Private/Admin
const updateController = asyncHandler(async (req, res) => {
  const controller = await Controller.findById(req.params.id);

  if (!controller) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }

  const updated = await Controller.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// @desc    Delete a controller
// @route   DELETE /api/controllers/:id
// @access  Private/Admin
const deleteController = asyncHandler(async (req, res) => {
  const controller = await Controller.findById(req.params.id);

  if (!controller) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }

  await controller.deleteOne();
  res.json({ message: "Đã xóa sản phẩm" });
});

export {
  getControllers,
  getControllerById,
  createController,
  updateController,
  deleteController,
};