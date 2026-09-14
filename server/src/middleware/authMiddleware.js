import { verifyToken } from "../config/jwt.js";
import User from "../models/User.js";

// Protect routes - require valid JWT
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = verifyToken(token);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Người dùng không tồn tại." });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      return res
        .status(401)
        .json({ message: "Token không hợp lệ, vui lòng đăng nhập lại." });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, vui lòng đăng nhập." });
  }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Yêu cầu quyền quản trị viên." });
  }
};