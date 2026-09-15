import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getControllers } from "../services/controllerService.js";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Dropdown from "../components/Dropdown.jsx";
import Card from "../components/Card.jsx";
import { useCart } from "../context/CartContext.jsx";
import { Loading, ErrorMessage } from "../components/Loader.jsx";
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
        <div className="flex gap-2 flex-wrap" style={{ alignItems: "flex-end" }}>
          <Input
            placeholder="Tìm tay cầm..."
            value={searchText}
            onChange={handleSearch}
            style={{ flex: 1, minWidth: "180px" }}
          />
          <Dropdown
            placeholder="Tất cả các hãng"
            options={allBrands}
            value={selectedBrand}
            onChange={handleBrandChange}
            style={{ flex: 1, minWidth: "180px" }}
          />
          <Button variant="secondary" onClick={handleClearFilters}>
            Xóa lọc
          </Button>
        </div>
        <div className="mt-1" style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          {total > 0 && <span>Tìm thấy {total} sản phẩm</span>}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchControllers} />}

      {loading && <Loading text="Đang tải sản phẩm..." />}

      {!loading && !error && controllers.length === 0 && (
        <div className="text-center mt-2" style={{ padding: "3rem", color: "#6b7280" }}>
          Không tìm thấy tay cầm nào.
        </div>
      )}

      <div className="grid grid-3 gap-2" style={{ marginTop: "1.5rem" }}>
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
        <div className="flex gap-1 mt-2" style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </Button>
          <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
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