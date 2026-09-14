import { Link } from "react-router-dom";
import Button from "./Button.jsx";

// Card dùng để hiển thị một sản phẩm (tay cầm) trong cửa hàng
// Gồm: ảnh, tên, hãng, giá và nút thêm vào giỏ hàng
function Card(props) {
  // Hàm đổi số sang dạng tiền tệ, ví dụ: 59.99 -> $59.99
  function formatPrice(price) {
    return "$" + Number(price).toFixed(2);
  }

  const isOutOfStock = props.stock !== undefined && props.stock <= 0;

  const cardContent = (
    <>
      {/* Nếu không có ảnh thì dùng ảnh mặc định */}
      <img
        className="card-image"
        src={props.image || "https://placehold.co/300x200?text=Controller"}
        alt={props.name}
      />

      <div className="card-body">
        <h3 className="card-title">{props.name}</h3>
        <p className="card-brand">{props.brand}</p>
        <p className="card-price">{formatPrice(props.price)}</p>

        {props.stock !== undefined && (
          <p className={`card-stock ${isOutOfStock ? "out-of-stock" : "in-stock"}`}>
            {isOutOfStock ? "Hết hàng" : `Còn ${props.stock} sản phẩm`}
          </p>
        )}

        <Button
          variant="primary"
          size="small"
          onClick={props.onAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </Button>
      </div>
    </>
  );

  if (props.link) {
    return (
      <Link to={props.link} className="card-link">
        <div className="card">{cardContent}</div>
      </Link>
    );
  }

  return <div className="card">{cardContent}</div>;
}

export default Card;