# Game Controller Shop

Website cửa hàng tay cầm chơi game, được xây dựng như một dự án học tập (MERN stack).

## Tính năng

- **Duyệt sản phẩm**: Xem danh sách tay cầm, tìm kiếm theo tên, lọc theo thương hiệu
- **Chi tiết sản phẩm**: Xem thông tin đầy đủ (giá, mô tả, tương thích, kết nối, tồn kho, đánh giá)
- **Giỏ hàng**: Thêm/xóa/sửa số lượng sản phẩm, lưu giỏ hàng trong localStorage
- **Thanh toán**: Điền thông tin giao hàng, đặt hàng COD (thanh toán khi nhận hàng)
- **Đăng ký/Đăng nhập**: Xác thực JWT, mật khẩu được hash bằng bcrypt
- **Quản lý đơn hàng**: Xem lịch sử đơn hàng, chi tiết đơn hàng
- **Trang quản trị**: Thêm/sửa/xóa sản phẩm (chỉ admin)

## Công nghệ sử dụng

- **M**ongoDB — Cơ sở dữ liệu
- **E**xpress.js — Backend framework
- **R**eact.js — Frontend UI
- **N**ode.js — Runtime

## Cấu trúc dự án

```
Game-Controller-Shop/
├── server/          # Backend (Node.js + Express + MongoDB) — MVC pattern
│   └── src/
│       ├── config/      # Kết nối DB, biến môi trường
│       ├── models/      # Mongoose models (Controller, User, Order)
│       ├── controllers/ # Xử lý request (logic)
│       ├── routes/      # Định nghĩa route
│       ├── middleware/  # Middleware (auth, error handling, async handler)
│       └── seeder.js    # Script seed dữ liệu mẫu
├── client/          # Frontend (React + Vite)
│   └── src/
│       ├── components/  # Component dùng chung (Button, Card, Input, Dropdown, Header)
│       ├── context/     # React Context (Cart, Auth)
│       ├── pages/       # Các trang (Home, ProductDetail, Cart, Checkout, Login, Register, Admin, MyOrders, OrderDetail)
│       ├── services/    # Gọi API
│       └── ...
└── package.json     # Monorepo root (scripts chạy cả hai)
```

## Bắt đầu

```bash
# 1. Cài đặt dependencies (root + server + client)
npm install
npm run install:all

# 2. Cấu hình biến môi trường (xem server/.env.example và client/.env.example)
# - Sao chép server/.env.example thành server/.env và điền MONGO_URI
# - Sao chép client/.env.example thành client/.env

# 3. Seed dữ liệu mẫu (tùy chọn)
npm run seed --prefix server

# 4. Chạy cả server và client
npm run dev
```

- Server: http://localhost:5000
- Client: http://localhost:5173

## Biến môi trường

### Server (`server/.env`)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| PORT | Cổng server | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| CLIENT_URL | URL frontend (cho CORS) | http://localhost:5173 |
| NODE_ENV | Môi trường | development |
| JWT_SECRET | Khóa bí mật JWT | your-secret-key |

### Client (`client/.env`)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| VITE_API_URL | URL API backend | http://localhost:5000/api |

## Tài khoản demo Admin

Sau khi seed dữ liệu, bạn có thể đăng ký tài khoản với email `admin@example.com` để có quyền truy cập trang quản trị.

## API Endpoints

### Controllers (Sản phẩm)
- `GET /api/controllers` — Lấy danh sách sản phẩm
- `GET /api/controllers/:id` — Lấy chi tiết sản phẩm
- `POST /api/controllers` — Tạo sản phẩm mới (Admin)
- `PUT /api/controllers/:id` — Cập nhật sản phẩm (Admin)
- `DELETE /api/controllers/:id` — Xóa sản phẩm (Admin)

### Auth (Xác thực)
- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/login` — Đăng nhập
- `GET /api/auth/me` — Lấy thông tin người dùng hiện tại

### Orders (Đơn hàng)
- `POST /api/orders` — Tạo đơn hàng mới
- `GET /api/orders/my` — Lấy đơn hàng của người dùng hiện tại
- `GET /api/orders/:id` — Lấy chi tiết đơn hàng

## Ghi chú cho sinh viên

- Code được viết ưu tiên **đơn giản, dễ đọc, dễ hiểu** hơn là tối ưu hiệu năng
- Sử dụng `async/await` thay vì Promise chains
- Component và function được tách nhỏ, có comment tiếng Việt
- Không dùng thư viện phức tạp (Redux, React Query, Tailwind...) để tập trung vào nền tảng
- Backend theo pattern MVC chuẩn, dễ mở rộng