import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import "./OrderDetailPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function OrderDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading, getAuthHeader } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchOrder();
    }
  }, [user, id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: getAuthHeader(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không tìm thấy đơn hàng.");
      }

      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function formatPrice(price) {
    return "$" + Number(price).toFixed(2);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusLabel(status) {
    const labels = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đã gửi hàng",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  }

  function getStatusClass(status) {
    const classes = {
      pending: "status-pending",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };
    return classes[status] || "";
  }

  if (authLoading) {
    return <div className="loading">Đang kiểm tra đăng nhập...</div>;
  }

  if (!user) {
    return (
      <div className="order-detail-page">
        <div className="auth-required">
          <h1>Yêu cầu đăng nhập</h1>
          <p>Vui lòng đăng nhập để xem chi tiết đơn hàng.</p>
          <Link to="/login">
            <Button variant="primary" size="large">Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Đang tải đơn hàng...</div>;
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="error-container">
          <p className="error-message">{error || "Không tìm thấy đơn hàng."}</p>
          <Link to="/orders">
            <Button variant="primary">Quay về đơn hàng của tôi</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/orders">Đơn hàng của tôi</Link>
        <span>/</span>
        <span>#{order._id.slice(-8).toUpperCase()}</span>
      </div>

      <div className="order-detail">
        <div className="order-header">
          <div>
            <h1>Đơn hàng #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="order-date">Đặt ngày: {formatDate(order.createdAt)}</p>
          </div>
          <span className={`order-status ${getStatusClass(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="order-grid">
          <div className="order-section">
            <h2>Sản phẩm</h2>
            <div className="order-items">
              {order.orderItems.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <img
                    src={item.image || "https://placehold.co/80x60?text=Controller"}
                    alt={item.name}
                    className="order-item-detail-image"
                  />
                  <div className="order-item-detail-info">
                    <Link to={`/product/${item.product}`} className="order-item-detail-name">
                      {item.name}
                    </Link>
                    <p className="order-item-detail-qty">Số lượng: {item.quantity}</p>
                    <p className="order-item-detail-price">{formatPrice(item.price)}</p>
                  </div>
                  <p className="order-item-detail-total">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-section">
            <h2>Thông tin đơn hàng</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Phương thức thanh toán</label>
                <span>{order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : order.paymentMethod}</span>
              </div>
              <div className="info-item">
                <label>Trạng thái</label>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            <h3>Địa chỉ giao hàng</h3>
            <div className="shipping-address">
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}</p>
            </div>

            {order.notes && (
              <div className="order-notes">
                <h3>Ghi chú</h3>
                <p>{order.notes}</p>
              </div>
            )}

            <div className="order-summary-detail">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>{formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-actions">
          <Link to="/orders">
            <Button variant="secondary">Quay về danh sách</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;