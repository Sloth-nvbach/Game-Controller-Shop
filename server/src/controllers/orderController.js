import Order from "../models/Order.js";
import Controller from "../models/Controller.js";
import mongoose from "mongoose";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "Không có sản phẩm trong đơn hàng." });
  }

  // Validate each item and fetch product details from DB
  const productIds = orderItems.map((item) => item.product);
  
  // Check for valid ObjectIds
  const invalidIds = productIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    return res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
  }

  // Fetch products from database
  const products = await Controller.find({ _id: { $in: productIds } });
  
  if (products.length !== productIds.length) {
    return res.status(400).json({ message: "Một hoặc nhiều sản phẩm không tồn tại." });
  }

  // Create a map for quick lookup
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  // Validate stock and build order items with server-calculated prices
  let itemsPrice = 0;
  const validatedOrderItems = [];

  for (const item of orderItems) {
    const product = productMap.get(item.product.toString());
    
    if (!product) {
      return res.status(400).json({ message: `Sản phẩm ${item.product} không tồn tại.` });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({ 
        message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho.` 
      });
    }

    const itemPrice = product.price;
    itemsPrice += itemPrice * item.quantity;

    validatedOrderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: itemPrice,
      quantity: item.quantity,
    });
  }

  const shippingPrice = 0; // Free shipping
  const totalPrice = itemsPrice + shippingPrice;

  // Create order
  const order = new Order({
    user: req.user._id,
    orderItems: validatedOrderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    notes,
  });

  // Use a session for atomic stock decrement
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Decrement stock for each product
    for (const item of validatedOrderItems) {
      await Controller.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );
    }

    // Save order
    const createdOrder = await order.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Tạo đơn hàng thất bại." });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("orderItems.product", "name image"),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    orders,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name image price");

  if (order) {
    // Check if order belongs to user or user is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Không có quyền xem đơn hàng này." });
    }
    res.json(order);
  } else {
    res.status(404).json({ message: "Không tìm thấy đơn hàng." });
  }
};