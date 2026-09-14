import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getControllers } from "../services/controllerService.js";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Dropdown from "../components/Dropdown.jsx";
import Card from "../components/Card.jsx";
import { useCart } from "../context/CartContext.jsx";
import "./HomePage.css";

function HomePage() {
  const { addToCart } = useCart();
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [allBrands, setAllBrands] = useState([]);

  const fetchControllers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getControllers({
        page,
        limit: 12,
        search: searchText,
        brand: selectedBrand,
      });
      setControllers(data.controllers);
      setPages(data.pages);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchText, selectedBrand]);

  // Fetch controllers when page, search, or brand changes
  useEffect(() => {
    fetchControllers();
  }, [fetchControllers]);

  // Fetch all brands for dropdown (from first page load or separate call)
  useEffect(() => {
    getControllers({ limit: 100 })
      .then((data) => {
        const brands = Array.from(
          new Set(data.controllers.map((c) => c.brand))
        ).map((brand) => ({ value: brand, label: brand }));
        setAllBrands(brands);
      })
      .catch(console.error);
  }, []);

  function handleAddToCart(controller) {
    addToCart(controller);
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedBrand("");
    setPage(1);
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Game Controller Shop</h1>
        <p>Khám phá tay cầm chơi game chính hãng, đa dạng thương hiệu</p>
      </div>

      <div className="filter-section">
        <div className="filter-bar">
          <Input
            placeholder="Tìm tay cầm..."
            value={searchText}
            onChange={handleSearch}
          />
          <Dropdown
            placeholder="Tất cả các hãng"
            options={allBrands}
            value={selectedBrand}
            onChange={handleBrandChange}
          />
          <Button variant="secondary" onClick={handleClearFilters}>
            Xóa lọc
          </Button>
        </div>
        <div className="filter-info">
          {total > 0 && <span>Tìm thấy {total} sản phẩm</span>}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Đang tải...</div>}

      {!loading && !error && controllers.length === 0 && (
        <p className="no-results">Không tìm thấy tay cầm nào.</p>
      )}

      <div className="card-grid">
        {controllers.map((c) => (
          <Card
            key={c._id}
            name={c.name}
            brand={c.brand}
            price={c.price}
            image={c.image}
            stock={c.stock}
            onAddToCart={() => handleAddToCart(c)}
            link={`/product/${c._id}`}
          />
        ))}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <Button
            variant="secondary"
            size="small"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </Button>
          <span className="page-info">
            Trang {page} / {pages}
          </span>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}

export default HomePage;