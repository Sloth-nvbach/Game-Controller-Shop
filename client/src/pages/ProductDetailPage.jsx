import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getControllerById } from "../services/controllerService.js";
import Button from "../components/Button.jsx";
import { useCart } from "../context/CartContext.jsx";
import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getControllerById(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        setError("Không thể tải thông tin sản phẩm.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <p className="error-message">{error || "Không tìm thấy sản phẩm."}</p>
          <Link to="/" className="btn-back">
            <Button variant="primary">Quay về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  function formatPrice(price) {
    return "$" + Number(price).toFixed(2);
  }

  function handleAddToCart() {
    addToCart(product);
  }

  return (
    <div className="product-detail-page">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/">Tay cầm</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-gallery">
          <img
            src={product.image || "https://placehold.co/600x400?text=Controller"}
            alt={product.name}
            className="main-image"
          />
        </div>

        <div className="product-info">
          <p className="product-brand">{product.brand}</p>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">{formatPrice(product.price)}</p>

          <div className="product-meta">
            <div className="meta-item">
              <strong>Trạng thái:</strong>
              <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}
              </span>
            </div>
            <div className="meta-item">
              <strong>Kết nối:</strong>
              <span>{product.connection}</span>
            </div>
            <div className="meta-item">
              <strong>Đánh giá:</strong>
              <span>{product.rating}/5 ⭐</span>
            </div>
            <div className="meta-item">
              <strong>Tương thích:</strong>
              <span>{product.compatibility.join(", ")}</span>
            </div>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-actions">
            <Button
              variant="primary"
              size="large"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </Button>
            <Link to="/cart">
              <Button variant="secondary" size="large">
                Xem giỏ hàng
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;