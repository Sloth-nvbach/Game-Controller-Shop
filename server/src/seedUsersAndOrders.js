// Seed users and orders
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Controller from "./models/Controller.js";
import Order from "./models/Order.js";
import bcrypt from "bcryptjs";

const seedUsersAndOrders = async () => {
  try {
    await connectDB();

    // --- Tạo users ---
    const salt = await bcrypt.genSalt(10);

    const usersData = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("123123", salt),
        isAdmin: true,
      },
      {
        name: "Nguyễn Văn An",
        email: "an@example.com",
        password: await bcrypt.hash("123123", salt),
        isAdmin: false,
      },
      {
        name: "Trần Thị Bình",
        email: "binh@example.com",
        password: await bcrypt.hash("123123", salt),
        isAdmin: false,
      },
      {
        name: "Lê Văn Cường",
        email: "cuong@example.com",
        password: await bcrypt.hash("123123", salt),
        isAdmin: false,
      },
    ];

    // Xóa users cũ (trừ admin nếu muốn giữ)
    await User.deleteMany({ email: { $in: usersData.map(u => u.email) } });
    console.log("Old users removed");

    const createdUsers = await User.insertMany(usersData);
    console.log(`${createdUsers.length} users created`);

    const adminUser = createdUsers.find(u => u.isAdmin);
    const regularUsers = createdUsers.filter(u => !u.isAdmin);

    // --- Lấy controllers để tạo orders ---
    const controllers = await Controller.find().limit(10);
    if (controllers.length === 0) {
      console.log("No controllers found, skipping orders");
      await mongoose.disconnect();
      process.exit(0);
    }

    // --- Tạo orders mẫu ---
    const ordersData = [
      {
        user: regularUsers[0]._id,
        orderItems: [
          { product: controllers[0]._id, name: controllers[0].name, image: controllers[0].image, price: controllers[0].price, quantity: 1 },
          { product: controllers[1]._id, name: controllers[1].name, image: controllers[1].image, price: controllers[1].price, quantity: 2 },
        ],
        shippingAddress: { fullName: "Nguyễn Văn An", phone: "0901234567", address: "123 Đường ABC", city: "Hà Nội" },
        paymentMethod: "COD",
        itemsPrice: controllers[0].price + controllers[1].price * 2,
        shippingPrice: 0,
        totalPrice: controllers[0].price + controllers[1].price * 2,
        isPaid: false,
        isDelivered: false,
        status: "delivered",
        deliveredAt: new Date(Date.now() - 86400000 * 5),
      },
      {
        user: regularUsers[0]._id,
        orderItems: [
          { product: controllers[2]._id, name: controllers[2].name, image: controllers[2].image, price: controllers[2].price, quantity: 1 },
        ],
        shippingAddress: { fullName: "Nguyễn Văn An", phone: "0901234567", address: "123 Đường ABC", city: "Hà Nội" },
        paymentMethod: "COD",
        itemsPrice: controllers[2].price,
        shippingPrice: 0,
        totalPrice: controllers[2].price,
        isPaid: false,
        isDelivered: false,
        status: "shipped",
      },
      {
        user: regularUsers[1]._id,
        orderItems: [
          { product: controllers[3]._id, name: controllers[3].name, image: controllers[3].image, price: controllers[3].price, quantity: 1 },
          { product: controllers[4]._id, name: controllers[4].name, image: controllers[4].image, price: controllers[4].price, quantity: 1 },
        ],
        shippingAddress: { fullName: "Trần Thị Bình", phone: "0912345678", address: "456 Đường XYZ", city: "TP.HCM" },
        paymentMethod: "COD",
        itemsPrice: controllers[3].price + controllers[4].price,
        shippingPrice: 0,
        totalPrice: controllers[3].price + controllers[4].price,
        isPaid: false,
        isDelivered: false,
        status: "processing",
      },
      {
        user: regularUsers[2]._id,
        orderItems: [
          { product: controllers[5]._id, name: controllers[5].name, image: controllers[5].image, price: controllers[5].price, quantity: 2 },
        ],
        shippingAddress: { fullName: "Lê Văn Cường", phone: "0923456789", address: "789 Đường DEF", city: "Đà Nẵng" },
        paymentMethod: "COD",
        itemsPrice: controllers[5].price * 2,
        shippingPrice: 0,
        totalPrice: controllers[5].price * 2,
        isPaid: false,
        isDelivered: false,
        status: "pending",
      },
      {
        user: regularUsers[0]._id,
        orderItems: [
          { product: controllers[6]._id, name: controllers[6].name, image: controllers[6].image, price: controllers[6].price, quantity: 1 },
        ],
        shippingAddress: { fullName: "Nguyễn Văn An", phone: "0901234567", address: "123 Đường ABC", city: "Hà Nội" },
        paymentMethod: "COD",
        itemsPrice: controllers[6].price,
        shippingPrice: 0,
        totalPrice: controllers[6].price,
        isPaid: false,
        isDelivered: false,
        status: "cancelled",
      },
    ];

    await Order.deleteMany({ user: { $in: regularUsers.map(u => u._id) } });
    console.log("Old orders removed");

    const createdOrders = await Order.insertMany(ordersData);
    console.log(`${createdOrders.length} orders created`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding users/orders failed:", error.message);
    process.exit(1);
  }
};

seedUsersAndOrders();