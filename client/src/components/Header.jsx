import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "./Button.jsx";
import "./Header.css";

export default function Header() {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = getTotalItems();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Game Controller Shop
        </Link>
        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          {isAuthenticated ? (
            <>
              {isAdmin && <Link to="/admin">Quản trị</Link>}
              <Link to="/orders">Đơn hàng của tôi</Link>
              <Link to="/cart" className="cart-link">
                Giỏ hàng
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-menu">
                <span className="user-name">Xin chào, {user?.name}</span>
                <Button variant="secondary" size="small" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="small">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="small">
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}