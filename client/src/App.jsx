import { useEffect, useState } from "react";
import { getControllers } from "./services/controllerService.js";
import Button from "./components/Button.jsx";
import Input from "./components/Input.jsx";
import Dropdown from "./components/Dropdown.jsx";
import Card from "./components/Card.jsx";
import "./components/components.css";

const brandOptions = [
  { value: "Sony", label: "Sony" },
  { value: "Microsoft", label: "Microsoft" },
  { value: "Nintendo", label: "Nintendo" },
];

function App() {
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    getControllers()
      .then((data) => setControllers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Lọc danh sách theo ô tìm kiếm và hãng đã chọn
  const filteredControllers = controllers.filter(function (c) {
    const matchName = c.name.toLowerCase().includes(searchText.toLowerCase());
    const matchBrand = selectedBrand === "" || c.brand === selectedBrand;
    return matchName && matchBrand;
  });

  // Hàm mẫu xử lý khi bấm "Thêm vào giỏ" (làm giỏ hàng ở bước sau)
  function handleAddToCart(controller) {
    alert("Đã thêm: " + controller.name);
  }

  return (
    <div className="app">
      <h1>Game Controller Shop</h1>

      <div className="filter-bar">
        <Input
          placeholder="Tìm tay cầm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Dropdown
          placeholder="Tất cả các hãng"
          options={brandOptions}
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => {
            setSearchText("");
            setSelectedBrand("");
          }}
        >
          Xóa lọc
        </Button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && filteredControllers.length === 0 && (
        <p>Không tìm thấy tay cầm nào.</p>
      )}

      <div className="card-grid">
        {filteredControllers.map((c) => (
          <Card
            key={c._id}
            name={c.name}
            brand={c.brand}
            price={c.price}
            image={c.image}
            onAddToCart={() => handleAddToCart(c)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
