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
    image: "https://placehold.co/300x200?text=DualSense",
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
    image: "https://placehold.co/300x200?text=Xbox+Controller",
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
    image: "https://placehold.co/300x200?text=Switch+Pro",
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
    image: "https://placehold.co/300x200?text=8BitDo",
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
    image: "https://placehold.co/300x200?text=Razer+Wolverine",
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
    image: "https://placehold.co/300x200?text=DualShock+4",
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
    image: "https://placehold.co/300x200?text=Elite+Series+2",
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
    image: "https://placehold.co/300x200?text=Logitech+F310",
    stock: 60,
    rating: 3.9,
  },
  // Additional 20 controllers
  {
    name: "DualSense Edge",
    brand: "Sony",
    price: 199.99,
    description:
      "Premium PS5 controller with swappable stick caps, back buttons, and customizable profiles.",
    compatibility: ["PS5", "PC"],
    connection: "Both",
    image: "https://placehold.co/300x200?text=DualSense+Edge",
    stock: 10,
    rating: 4.7,
  },
  {
    name: "Xbox Core Controller - Carbon Black",
    brand: "Microsoft",
    price: 54.99,
    description:
      "Updated Xbox controller with hybrid D-pad, textured grip, and Bluetooth.",
    compatibility: ["Xbox Series X|S", "PC", "Mobile"],
    connection: "Wireless",
    image: "https://placehold.co/300x200?text=Xbox+Core",
    stock: 35,
    rating: 4.6,
  },
  {
    name: "8BitDo Pro 2",
    brand: "8BitDo",
    price: 49.99,
    description:
      "Versatile controller with hall effect sticks, 8000mAh battery, and ultimate software support.",
    compatibility: ["PC", "Nintendo Switch", "Android", "Raspberry Pi"],
    connection: "Both",
    image: "https://placehold.co/300x200?text=8BitDo+Pro+2",
    stock: 25,
    rating: 4.8,
  },
  {
    name: "Razer Wolverine V2 Chroma",
    brand: "Razer",
    price: 149.99,
    description:
      "Wired tournament controller with 6 remappable buttons, Razer Chroma RGB, and mecha-tactile buttons.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=Wolverine+V2+Chroma",
    stock: 8,
    rating: 4.5,
  },
  {
    name: "GameSir G7 SE",
    brand: "GameSir",
    price: 44.99,
    description:
      "Wired Xbox controller with hall effect sticks, hair triggers, and 4 back buttons.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=GameSir+G7+SE",
    stock: 30,
    rating: 4.4,
  },
  {
    name: "Nacon Revolution X Pro",
    brand: "Nacon",
    price: 119.99,
    description:
      "Pro-grade Xbox controller with 4 back buttons, removable weights, and Dolby Atmos support.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=Nacon+Revolution+X",
    stock: 7,
    rating: 4.3,
  },
  {
    name: "PowerA Fusion Pro 2",
    brand: "PowerA",
    price: 79.99,
    description:
      "Wireless Switch controller with mappable buttons, adjustable sticks, and 20-hour battery.",
    compatibility: ["Nintendo Switch"],
    connection: "Wireless",
    image: "https://placehold.co/300x200?text=PowerA+Fusion+Pro+2",
    stock: 15,
    rating: 4.2,
  },
  {
    name: "Hori Fighting Commander Octa",
    brand: "Hori",
    price: 59.99,
    description:
      "Six-button fighting game controller optimized for 2D fighters on PS5 and PC.",
    compatibility: ["PS5", "PS4", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=Hori+Octa",
    stock: 12,
    rating: 4.5,
  },
  {
    name: "Thrustmaster eSwap X Pro",
    brand: "Thrustmaster",
    price: 159.99,
    description:
      "Modular controller with hot-swappable sticks, 4 rear buttons, and T-MOD technology.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=Thrustmaster+eSwap+X",
    stock: 6,
    rating: 4.4,
  },
  {
    name: "SteelSeries Stratus Duo",
    brand: "SteelSeries",
    price: 59.99,
    description:
      "Dual wireless (2.4GHz + Bluetooth) controller for PC, Android, and VR.",
    compatibility: ["PC", "Android", "VR"],
    connection: "Wireless",
    image: "https://placehold.co/300x200?text=Stratus+Duo",
    stock: 22,
    rating: 4.3,
  },
  {
    name: "PDP Victrix Pro BFG",
    brand: "PDP",
    price: 179.99,
    description:
      "Modular fight stick style controller with swappable modules for PS5 and PC.",
    compatibility: ["PS5", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=Victrix+Pro+BFG",
    stock: 5,
    rating: 4.6,
  },
  {
    name: "GameSir T4 Kaleid",
    brand: "GameSir",
    price: 41.99,
    description:
      "Transparent wired controller with hall effect sticks, RGB lighting, and hair triggers.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=GameSir+T4+Kaleid",
    stock: 28,
    rating: 4.4,
  },
  {
    name: "Flydigi Vader 3 Pro",
    brand: "Flydigi",
    price: 55.99,
    description:
      "Hall effect sticks, 1000Hz polling rate, and Force GC 3.0 algorithm for mobile/PC/Switch.",
    compatibility: ["PC", "Nintendo Switch", "Android", "iOS"],
    connection: "Both",
    image: "https://placehold.co/300x200?text=Flydigi+Vader+3+Pro",
    stock: 18,
    rating: 4.5,
  },
  {
    name: "Xbox Elite Series 2 Core",
    brand: "Microsoft",
    price: 129.99,
    description:
      "Essential version of Elite Series 2 without accessories, adjustable tension sticks.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Both",
    image: "https://placehold.co/300x200?text=Elite+Series+2+Core",
    stock: 8,
    rating: 4.5,
  },
  {
    name: "8BitDo Ultimate Bluetooth",
    brand: "8BitDo",
    price: 49.99,
    description:
      "Bluetooth controller with charging dock, hall effect sticks, and 480mAh battery.",
    compatibility: ["PC", "Nintendo Switch", "Android", "Steam Deck"],
    connection: "Wireless",
    image: "https://placehold.co/300x200?text=8BitDo+Ultimate+BT",
    stock: 32,
    rating: 4.7,
  },
  {
    name: "Razer Kitsune",
    brand: "Razer",
    price: 299.99,
    description:
      "All-button optical arcade controller for fighting games on PS5 and PC.",
    compatibility: ["PS5", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=Razer+Kitsune",
    stock: 4,
    rating: 4.8,
  },
  {
    name: "GameSir G8 Galileo",
    brand: "GameSir",
    price: 79.99,
    description:
      "Mobile controller with hall effect sticks, pass-through charging, and movable faceplates.",
    compatibility: ["iOS", "Android"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=GameSir+G8+Galileo",
    stock: 14,
    rating: 4.6,
  },
  {
    name: "Backbone One - PlayStation Edition",
    brand: "Backbone",
    price: 99.99,
    description:
      "Mobile controller for iPhone with PS Remote Play integration and 3.5mm headset jack.",
    compatibility: ["iOS"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=Backbone+One+PS",
    stock: 20,
    rating: 4.7,
  },
  {
    name: "Logitech G Cloud",
    brand: "Logitech",
    price: 349.99,
    description:
      "Handheld cloud gaming device with 7-inch 1080p screen, Snapdragon 720G, and 12+ hour battery.",
    compatibility: ["Cloud Gaming (Xbox Cloud, GeForce Now, Steam Link)"],
    connection: "Wireless",
    image: "https://placehold.co/300x200?text=Logitech+G+Cloud",
    stock: 3,
    rating: 4.4,
  },
  {
    name: "Turtle Beach Recon Controller",
    brand: "Turtle Beach",
    price: 59.99,
    description:
      "Wired Xbox controller with Pro-Aim focus mode, 4 quick-action buttons, and audio controls.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=Turtle+Beach+Recon",
    stock: 16,
    rating: 4.3,
  },
  {
    name: "HyperX Clutch Gladiate",
    brand: "HyperX",
    price: 49.99,
    description:
      "Wired Xbox controller with dual trigger locks, remappable back buttons, and textured grip.",
    compatibility: ["Xbox Series X|S", "PC"],
    connection: "Wired",
    image: "https://placehold.co/300x200?text=HyperX+Clutch+Gladiate",
    stock: 24,
    rating: 4.4,
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
