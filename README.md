# Game Controller Shop

Website cửa hàng tay cầm chơi game, được xây dựng như một dự án học tập (MERN stack) cho khóa **WEB98 - MERN Stack**.

## Tính năng

- **Duyệt sản phẩm**: Xem danh sách tay cầm, tìm kiếm theo tên, lọc theo thương hiệu, phân trang
- **Chi tiết sản phẩm**: Xem thông tin đầy đủ (giá, mô tả, tương thích, kết nối, tồn kho, đánh giá)
- **Giỏ hàng**: Thêm/xóa/sửa số lượng sản phẩm, lưu giỏ hàng trong localStorage
- **Thanh toán**: Điền thông tin giao hàng, đặt hàng COD (thanh toán khi nhận hàng)
- **Đăng ký/Đăng nhập**: Xác thực JWT (access + refresh token), mật khẩu được hash bằng bcrypt
- **Quản lý đơn hàng**: Xem lịch sử đơn hàng, chi tiết đơn hàng
- **Trang quản trị**: Thêm/sửa/xóa sản phẩm (chỉ admin)

## Công nghệ sử dụng

- **M**ongoDB — Cơ sở dữ liệu
- **E**xpress.js — Backend framework
- **R**eact.js — Frontend UI (Vite)
- **N**ode.js — Runtime

## Cấu trúc dự án

```
Game-Controller-Shop/
├── server/          # Backend (Node.js + Express + MongoDB) — MVC pattern
│   └── src/
│       ├── config/      # Kết nối DB, biến môi trường, JWT
│       ├── models/      # Mongoose models (Controller, User, Order)
│       ├── controllers/ # Xử lý request (logic)
│       ├── routes/      # Định nghĩa route
│       ├── middleware/  # Middleware (auth, error handling, async handler, rate limiter)
│       └── seeder.js    # Script seed dữ liệu mẫu
├── client/          # Frontend (React + Vite)
│   └── src/
│       ├── components/  # Component dùng chung (Button, Card, Input, Dropdown, Header, Loader, Price)
│       ├── context/     # React Context (Cart, Auth)
│       ├── pages/       # Các trang (Home, ProductDetail, Cart, Checkout, Login, Register, Admin, MyOrders, OrderDetail)
│       ├── services/    # Gọi API (fetch wrapper)
│       └── ...
└── package.json     # Monorepo root (scripts chạy cả hai)
```

## Bắt đầu

### Yêu cầu
- Node.js >= 18
- MongoDB Atlas hoặc local MongoDB

### Cài đặt

```bash
# 1. Clone repository
git clone <repo-url>
cd Game-Controller-Shop

# 2. Cài đặt dependencies (root + server + client)
npm install
npm run install:all

# 3. Cấu hình biến môi trường
# Server
cp server/.env.example server/.env
# Chỉnh sửa server/.env: điền MONGO_URI, JWT_SECRET

# Client
cp client/.env.example client/.env
# Chỉnh sửa client/.env: điền VITE_API_URL (mặc định http://localhost:5000/api)

# 4. Seed dữ liệu mẫu (khuyến nghị)
npm run seed --prefix server

# 5. Chạy development (cả server và client)
npm run dev
```

- **Server**: http://localhost:5000
- **Client**: http://localhost:5173

### Scripts hữu ích

```bash
# Chạy riêng server
npm run server

# Chạy riêng client
npm run client

# Seed lại dữ liệu
npm run seed --prefix server

# Build production client
npm run build --prefix client
```

## Biến môi trường

### Server (`server/.env`)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| PORT | Cổng server | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.net/db |
| CLIENT_URL | URL frontend (cho CORS) | http://localhost:5173 |
| NODE_ENV | Môi trường | development |
| JWT_SECRET | Khóa bí mật JWT (min 32 chars) | your-super-secret-jwt-key-min-32-chars |
| JWT_EXPIRES_IN | Thời gian hết hạn access token | 15m |
| JWT_REFRESH_EXPIRES_IN | Thời gian hết hạn refresh token | 7d |

### Client (`client/.env`)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| VITE_API_URL | URL API backend | http://localhost:5000/api |

## Tài khoản demo Admin

Sau khi seed dữ liệu, đăng ký tài khoản với email `admin@example.com` để có quyền truy cập trang quản trị (`/admin`).

## API Endpoints

### Controllers (Sản phẩm)
- `GET /api/controllers` — Lấy danh sách sản phẩm (query: page, limit, search, brand, minPrice, maxPrice, connection, sortBy, sortOrder)
- `GET /api/controllers/:id` — Lấy chi tiết sản phẩm
- `POST /api/controllers` — Tạo sản phẩm mới (Admin)
- `PUT /api/controllers/:id` — Cập nhật sản phẩm (Admin)
- `DELETE /api/controllers/:id` — Xóa sản phẩm (Admin)

### Auth (Xác thực)
- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/login` — Đăng nhập
- `POST /api/auth/refresh` — Làm mới access token
- `GET /api/auth/me` — Lấy thông tin người dùng hiện tại

### Orders (Đơn hàng)
- `POST /api/orders` — Tạo đơn hàng mới (COD)
- `GET /api/orders/my` — Lấy đơn hàng của người dùng hiện tại
- `GET /api/orders/:id` — Lấy chi tiết đơn hàng

## Known Bugs (Đã biết, không ảnh hưởng luồng chính)

| # | Bug | Mô tả | Workaround |
|---|-----|-------|------------|
| 1 | **Cart không sync real-time giữa các tab** | Giỏ hàng dùng `localStorage` + `useReducer`, khi mở 2 tab cùng lúc, tab A thêm sản phẩm thì tab B không cập nhật ngay (chỉ cập nhật khi reload hoặc focus tab). | Đóng/mở tab hoặc reload trang. Có thể fix bằng `storage` event listener hoặc BroadcastChannel API. |
| 2 | **Admin modal không đóng khi click ESC** | Modal thêm/sửa sản phẩm chỉ đóng khi click nút Hủy hoặc click overlay, không hỗ trợ phím ESC. | Click nút Hủy hoặc click vùng tối bên ngoài modal. Fix: thêm `keydown` event listener cho `Escape` key. |

## Ghi chú cho sinh viên (WEB98)

- Code được viết ưu tiên **đơn giản, dễ đọc, dễ hiểu** hơn là tối ưu hiệu năng
- Sử dụng `async/await` thay vì Promise chains
- Component và function được tách nhỏ, có comment tiếng Việt
- Không dùng thư viện phức tạp (Redux, React Query, Tailwind, TypeScript...) để tập trung vào nền tảng MERN
- Backend theo pattern MVC chuẩn, dễ mở rộng
- Frontend dùng React Context cho state management (Cart, Auth)
- CSS dùng utility classes đơn giản trong `index.css` (không dùng Tailwind/UI library)

## Deployment (Gợi ý)

**Backend**: Render, Railway, Fly.io, hoặc VPS
- Set `NODE_ENV=production`
- Set `CLIENT_URL` = domain frontend production
- MongoDB Atlas production cluster

**Frontend**: Vercel, Netlify, Cloudflare Pages
- Build: `npm run build --prefix client`
- Output: `client/dist`
- Set `VITE_API_URL` = production backend URL

## License

MIT - Dự án học tập, tự do sử dụng cho mục đích giáo dục.