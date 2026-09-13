import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";

dotenv.config();

// Some networks (like school/cafe wifi) have a DNS server that cannot resolve
// MongoDB Atlas SRV records, so we use Google's public DNS instead.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;