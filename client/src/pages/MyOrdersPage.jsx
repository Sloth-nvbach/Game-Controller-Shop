import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import "./MyOrdersPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function MyOrdersPage() {
  const { user, loading: authLoading, getAuthHeader } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/my`, {
        headers: getAuthHeader(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không thể tải đơn hàng.");
      }

      setOrders(data);
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
      <div className="my-orders-page">
        <div className="auth-required">
          <h1>Yêu cầu đăng nhập</h1>
          <p>Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
          <Link to="/login">
            <Button variant="primary" size="large">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <h1>Đơn hàng của tôi</h1>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Đang tải đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/">
            <Button variant="primary" size="large">
              Mua sắm ngay
            </Button>
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Đơn hàng #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-items-preview">
                {order.orderItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="order-item-preview">
                    <img
                      src={item.image || "https://placehold.co/50x40?text=Controller"}
                      alt={item.name}
                    />
                    <div className="order-item-preview-info">
                      <p className="order-item-preview-name">{item.name}</p>
                      <p className="order-item-preview-qty">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <div className="order-item-more">
                    +{order.orderItems.length - 3} sản phẩm khác
                  </div>
                )}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Tổng cộng:</span>
                  <strong>{formatPrice(order.totalPrice)}</strong>
                </div>
                <Link to={`/orders/${order._id}`}>
                  <Button variant="secondary" size="small">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;