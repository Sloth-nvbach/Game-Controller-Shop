import { body, param, query, validationResult } from "express-validator";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// Validation rules for controller creation
export const validateCreateController = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên sản phẩm là bắt buộc")
    .isLength({ max: 100 })
    .withMessage("Tên sản phẩm không quá 100 ký tự"),
  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Thương hiệu là bắt buộc")
    .isLength({ max: 50 })
    .withMessage("Thương hiệu không quá 50 ký tự"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số dương"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Mô tả không quá 2000 ký tự"),
  body("compatibility")
    .optional()
    .isArray()
    .withMessage("Tương thích phải là mảng"),
  body("compatibility.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Mỗi mục tương thích không quá 50 ký tự"),
  body("connection")
    .optional()
    .isIn(["Wireless", "Wired", "Both"])
    .withMessage("Kết nối phải là Wireless, Wired hoặc Both"),
  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL hình ảnh không hợp lệ"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Tồn kho phải là số nguyên không âm"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Đánh giá phải từ 0 đến 5"),
  handleValidationErrors,
];

// Validation rules for controller update (all fields optional)
export const validateUpdateController = [
  param("id").isMongoId().withMessage("ID sản phẩm không hợp lệ"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Tên sản phẩm không được rỗng")
    .isLength({ max: 100 })
    .withMessage("Tên sản phẩm không quá 100 ký tự"),
  body("brand")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Thương hiệu không được rỗng")
    .isLength({ max: 50 })
    .withMessage("Thương hiệu không quá 50 ký tự"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số dương"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Mô tả không quá 2000 ký tự"),
  body("compatibility")
    .optional()
    .isArray()
    .withMessage("Tương thích phải là mảng"),
  body("compatibility.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Mỗi mục tương thích không quá 50 ký tự"),
  body("connection")
    .optional()
    .isIn(["Wireless", "Wired", "Both"])
    .withMessage("Kết nối phải là Wireless, Wired hoặc Both"),
  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL hình ảnh không hợp lệ"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Tồn kho phải là số nguyên không âm"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Đánh giá phải từ 0 đến 5"),
  handleValidationErrors,
];

// Validation for ObjectId params
export const validateObjectId = [
  param("id").isMongoId().withMessage("ID không hợp lệ"),
  handleValidationErrors,
];

// Validation for pagination query
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Trang phải là số nguyên dương"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Giới hạn phải từ 1 đến 100"),
  handleValidationErrors,
];