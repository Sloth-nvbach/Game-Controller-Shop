import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { Price } from "../components/Price.jsx";
import { Loading } from "../components/Loader.jsx";
import "./CheckoutPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, loading: authLoading, getAuthHeader } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!user) {
      setError("Vui lòng đăng nhập để đặt hàng.");
      setSubmitting(false);
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const totalPrice = getTotalPrice();

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
          },
          paymentMethod: "COD",
          itemsPrice: totalPrice,
          shippingPrice: 0,
          totalPrice,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đặt hàng thất bại.");
      }

      clearCart();
      setSuccess(true);
      setSubmitting(false);

      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err) {
      setError(err.message || "Đặt hàng thất bại. Vui lòng thử lại.");
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <Loading text="Đang kiểm tra đăng nhập..." />;
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page empty">
        <div className="empty-checkout">
          <h1>Giỏ hàng trống</h1>
          <p>Bạn chưa có sản phẩm nào để thanh toán.</p>
          <Link to="/">
            <Button variant="primary" size="large">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-page success">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h1>Đặt hàng thành công!</h1>
          <p>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.</p>
          <p>Đang chuyển đến trang đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Thanh toán</h1>

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Thông tin liên hệ</h2>
              <div className="form-row">
                <Input
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Nguyễn Văn A"
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-row">
                <Input
                  label="Số điện thoại"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="090 123 4567"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Địa chỉ giao hàng</h2>
              <Input
                label="Địa chỉ chi tiết"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Số nhà, tên đường, phường/xã"
              />
              <Input
                label="Thành phố / Tỉnh"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
              />
            </div>

            <div className="form-section">
              <h2>Ghi chú (tùy chọn)</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Yêu cầu đặc biệt về giao hàng..."
                rows={3}
                className="textarea"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="place-order-btn"
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Đơn hàng của bạn</h2>
          <div className="order-items">
            {items.map((item) => (
              <div key={item._id} className="order-item">
                <img
                  src={item.image || "https://placehold.co/60x50?text=Controller"}
                  alt={item.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <p className="order-item-name">{item.name}</p>
                  <p className="order-item-qty">x{item.quantity}</p>
                </div>
                <p className="order-item-price">
                    <Price value={item.price * item.quantity} />
                  </p>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <div className="summary-row">
              <span>Tạm tính ({items.length} sản phẩm)</span>
              <span><Price value={getTotalPrice()} /></span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng</span>
              <span><Price value={getTotalPrice()} /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;