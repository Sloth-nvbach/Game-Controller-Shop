// Seed script - fills the database with sample controller data.
// Run it with: npm run seed
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import Controller from "./models/Controller.js";

// Sample game controllers for the shop
const controllers = [
  {
    name: "DualSense Wireless Controller",
    brand: "Sony",
    price: 69.99,
    description:
      "The official PS5 controller with haptic feedback and adaptive triggers.",
    compatibility: ["PS5", "PC"],
    connection: "Wireless",
    image: "https://via.placeholder.com/300x200?text=DualSense",
    stock: 25,
    rating: 4.8,
  },
  {
    name: "Xbox Wireless Controller",
    brand: "Microsoft",
    price: 59.99,
    description:
      "The classic Xbox controller, comfortable and works great on PC too.",
    compatibility: ["Xbox Series X|S", "PC", "Mobile"],
    connection: "Wireless",
    image: "https://via.placeholder.com/300x200?text=Xbox+Controller",
    stock: 40,
    rating: 4.7,
  },
  {
    name: "Nintendo Switch Pro Controller",
    brand: "Nintendo",
    price: 69.99,
    description:
      "A comfortable pro-style controller for the Nintendo Switch with long battery life.",
    compatibility: ["Nintendo Switch"],
    connection: "Wireless",
    image: "https://via.placeholder.com/300x200?text=Switch+Pro",
    stock: 18,
    rating: 4.6,
  },
  {
    name: "8BitDo Ultimate 2.4g",
    brand: "8BitDo",
    price: 39.99,
    description:
      "Affordable retro-styled controller with hall effect sticks, great for PC and Switch.",
    compatibility: ["PC", "Nintendo Switch"],
    connection: "Wireless",
    image: "https://via.placeholder.com/300x200?text=8BitDo",
    stock: 50,
    rating: 4.5,
  },
  {
    name: "Razer Wolverine V2",
    brand: "Razer",
    price: 99.99,
    description:
      "Wired esports controller with extra remappable buttons for competitive play.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Wired",
    image: "https://via.placeholder.com/300x200?text=Razer+Wolverine",
    stock: 12,
    rating: 4.3,
  },
  {
    name: "DualShock 4",
    brand: "Sony",
    price: 49.99,
    description:
      "The classic PS4 controller, still good for PC gaming and older consoles.",
    compatibility: ["PS4", "PC"],
    connection: "Both",
    image: "https://via.placeholder.com/300x200?text=DualShock+4",
    stock: 8,
    rating: 4.2,
  },
  {
    name: "Xbox Elite Series 2",
    brand: "Microsoft",
    price: 179.99,
    description:
      "Premium controller with adjustable tension sticks, paddles, and swappable parts.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Both",
    image: "https://via.placeholder.com/300x200?text=Elite+Series+2",
    stock: 5,
    rating: 4.6,
  },
  {
    name: "Logitech F310",
    brand: "Logitech",
    price: 24.99,
    description:
      "Budget friendly wired controller, plug and play on PC.",
    compatibility: ["PC"],
    connection: "Wired",
    image: "https://via.placeholder.com/300x200?text=Logitech+F310",
    stock: 60,
    rating: 3.9,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Remove old data first so we don't insert duplicates
    await Controller.deleteMany();
    console.log("Old data removed");

    await Controller.insertMany(controllers);
    console.log(`${controllers.length} controllers added to the database!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
