import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getControllers, 
  createController, 
  updateController, 
  deleteController 
} from "../services/controllerService.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import "./AdminPage.css";

function AdminPage() {
  const { isAdmin, user, loading: authLoading, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
    compatibility: "",
    connection: "Wireless",
    image: "",
    stock: "",
    rating: "",
  });

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [authLoading, isAdmin, navigate]);

  // Tải danh sách sản phẩm
  useEffect(() => {
    if (isAdmin) {
      getControllers()
        .then((data) => {
          setControllers(data);
          setError("");
        })
        .catch((err) => {
          setError("Không thể tải danh sách sản phẩm.");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      price: "",
      description: "",
      compatibility: "",
      connection: "Wireless",
      image: "",
      stock: "",
      rating: "",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      description: product.description || "",
      compatibility: product.compatibility.join(", "),
      connection: product.connection,
      image: product.image || "",
      stock: product.stock,
      rating: product.rating,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await deleteController(productId, getAuthHeader());
      setControllers(controllers.filter((c) => c._id !== productId));
    } catch (err) {
      setError("Xóa sản phẩm thất bại.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const productData = {
      name: formData.name,
      brand: formData.brand,
      price: Number(formData.price),
      description: formData.description,
      compatibility: formData.compatibility
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      connection: formData.connection,
      image: formData.image,
      stock: Number(formData.stock),
      rating: Number(formData.rating),
    };

    try {
      if (editingProduct) {
        await updateController(editingProduct._id, productData, getAuthHeader());
        setControllers(
          controllers.map((c) =>
            c._id === editingProduct._id ? { ...c, ...productData } : c
          )
        );
      } else {
        const newProduct = await createController(productData, getAuthHeader());
        setControllers([...controllers, newProduct]);
      }
      resetForm();
    } catch (err) {
      setError(editingProduct ? "Cập nhật thất bại." : "Tạo sản phẩm thất bại.");
    }
  };

  if (authLoading) {
    return <div className="loading">Đang kiểm tra quyền...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-page">
      <h1>Quản trị sản phẩm</h1>
      <p className="admin-subtitle">Chào mừng, {user?.name} (Admin)</p>

      <div className="admin-toolbar">
        <Button variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Thêm sản phẩm mới
        </Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="admin-form-card">
          <h2>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <Input
                label="Tên sản phẩm"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ví dụ: DualSense Wireless Controller"
              />
              <Input
                label="Thương hiệu"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="Ví dụ: Sony"
              />
            </div>
            <div className="form-row">
              <Input
                label="Giá ($)"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="59.99"
                min="0"
                step="0.01"
              />
              <select
                name="connection"
                value={formData.connection}
                onChange={handleChange}
                className="select-input"
              >
                <option value="Wireless">Wireless</option>
                <option value="Wired">Wired</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <Input
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết sản phẩm..."
              multiline
            />
            <Input
              label="Tương thích (cách nhau bằng dấu phẩy)"
              name="compatibility"
              value={formData.compatibility}
              onChange={handleChange}
              placeholder="PS5, PC"
            />
            <div className="form-row">
              <Input
                label="URL hình ảnh"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <Input
                label="Tồn kho"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="10"
                min="0"
              />
            </div>
            <Input
              label="Đánh giá (0-5)"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              placeholder="4.5"
              min="0"
              max="5"
              step="0.1"
            />
            <div className="form-actions">
              <Button type="submit" variant="primary" size="medium">
                {editingProduct ? "Cập nhật" : "Tạo sản phẩm"}
              </Button>
              <Button type="button" variant="secondary" size="medium" onClick={resetForm}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Đang tải danh sách sản phẩm...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Thương hiệu</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Đánh giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {controllers.map((c) => (
                <tr key={c._id}>
                  <td>
                    <img
                      src={c.image || "https://placehold.co/60x40?text=Controller"}
                      alt={c.name}
                      className="admin-thumb"
                    />
                  </td>
                  <td>{c.name}</td>
                  <td>{c.brand}</td>
                  <td>${Number(c.price).toFixed(2)}</td>
                  <td>{c.stock}</td>
                  <td>{c.rating}/5</td>
                  <td className="actions">
                    <Button variant="secondary" size="small" onClick={() => handleEdit(c)}>
                      Sửa
                    </Button>
                    <Button variant="danger" size="small" onClick={() => handleDelete(c._id)}>
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {controllers.length === 0 && (
            <p className="no-data">Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;