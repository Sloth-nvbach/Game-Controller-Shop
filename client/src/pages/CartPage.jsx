import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import Button from "../components/Button.jsx";
import { Price } from "../components/Price.jsx";
import "./CartPage.css";

function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="empty-cart">
          <h1>Giỏ hàng trống</h1>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link to="/">
            <Button variant="primary" size="large">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Giỏ hàng</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image || "https://placehold.co/100x80?text=Controller"}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <Link to={`/product/${item._id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <p className="cart-item-brand">{item.brand}</p>
                <p className="cart-item-price"><Price value={item.price} /></p>
              </div>
              <div className="cart-item-quantity">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="cart-item-total">
                <Price value={item.price * item.quantity} />
              </p>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item._id)}
                title="Xóa khỏi giỏ hàng"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Tóm tắt đơn hàng</h2>
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
          <Link to="/checkout">
            <Button variant="primary" size="large" className="checkout-btn">
              Tiến hành thanh toán
            </Button>
          </Link>
          <button
            className="clear-cart-btn"
            onClick={() => {
              if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
                clearCart();
              }
            }}
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </div>
      </div>

      <Link to="/" className="continue-shopping">
        ← Tiếp tục mua sắm
      </Link>
    </div>
  );
}

export default CartPage;