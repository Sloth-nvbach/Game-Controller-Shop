// User model - represents a customer of the shop
// (kept simple for now, can be used for login/register later)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Display name of the user
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email is used to log in, so it must be unique
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Plain password for now (a real project should hash this!)
    password: {
      type: String,
      required: true,
    },

    // True if the user is a shop admin
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
