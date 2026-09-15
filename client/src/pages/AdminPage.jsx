import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getControllers, createController, updateController, deleteController } from "../services/controllerService.js";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Dropdown from "../components/Dropdown.jsx";
import { Loading, ErrorMessage } from "../components/Loader.jsx";
import { Price } from "../components/Price.jsx";
import "./AdminPage.css";

const CONNECTION_OPTIONS = [
  { value: "Wireless", label: "Wireless" },
  { value: "Wired", label: "Wired" },
  { value: "Both", label: "Both" },
];

const COMPATIBILITY_OPTIONS = [
  "PC",
  "PS5",
  "PS4",
  "Xbox Series X/S",
  "Xbox One",
  "Nintendo Switch",
  "iOS",
  "Android",
];

function AdminPage() {
  const { getAuthHeader, isAdmin } = useAuth();
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingController, setEditingController] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
    connection: "Wireless",
    compatibility: [],
    stock: "",
    image: "",
    rating: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchControllers();
  }, []);

  const fetchControllers = async () => {
    setLoading(true);
    try {
      const data = await getControllers({ limit: 100 });
      setControllers(data.controllers);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingController(null);
    setFormData({
      name: "",
      brand: "",
      price: "",
      description: "",
      connection: "Wireless",
      compatibility: [],
      stock: "",
      image: "",
      rating: "0",
    });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (controller) => {
    setEditingController(controller);
    setFormData({
      name: controller.name,
      brand: controller.brand,
      price: controller.price,
      description: controller.description || "",
      connection: controller.connection,
      compatibility: controller.compatibility || [],
      stock: controller.stock,
      image: controller.image || "",
      rating: controller.rating || "0",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingController(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "compatibility") {
      if (checked) {
        setFormData({ ...formData, compatibility: [...formData.compatibility, value] });
      } else {
        setFormData({ ...formData, compatibility: formData.compatibility.filter((c) => c !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    const authHeader = getAuthHeader();
    if (!authHeader.Authorization) {
      setFormError("Không có quyền truy cập. Vui lòng đăng nhập lại.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: Number(formData.price),
        description: formData.description,
        connection: formData.connection,
        compatibility: formData.compatibility,
        stock: Number(formData.stock),
        image: formData.image,
        rating: Number(formData.rating),
      };

      if (editingController) {
        await updateController(editingController._id, payload, authHeader);
      } else {
        await createController(payload, authHeader);
      }

      closeModal();
      fetchControllers();
    } catch (err) {
      setFormError(err.message || "Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    const authHeader = getAuthHeader();
    try {
      await deleteController(id, authHeader);
      fetchControllers();
    } catch (err) {
      alert(err.message || "Xóa thất bại.");
    }
  };

  if (loading) {
    return <Loading text="Đang tải danh sách sản phẩm..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchControllers} />;
  }

  return (
    <div className="admin-page container">
      <div className="admin-header flex gap-2 mb-2" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h1>Quản trị sản phẩm</h1>
        <Button variant="primary" onClick={openCreateModal}>
          + Thêm sản phẩm
        </Button>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>Ảnh</th>
              <th>Tên</th>
              <th style={{ width: "120px" }}>Thương hiệu</th>
              <th style={{ width: "100px" }}>Giá</th>
              <th style={{ width: "80px" }}>Tồn kho</th>
              <th style={{ width: "100px" }}>Kết nối</th>
              <th style={{ width: "80px" }}>Đánh giá</th>
              <th style={{ width: "150px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {controllers.map((c) => (
              <tr key={c._id}>
                <td>
                  <img
                    src={c.image || "https://placehold.co/60x40?text=Controller"}
                    alt={c.name}
                    style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                  />
                </td>
                <td style={{ fontWeight: 500, maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</td>
                <td>{c.brand}</td>
                <td><Price value={c.price} /></td>
                <td>
                  <span className="badge" style={{ background: c.stock > 0 ? "#dcfce7" : "#fef2f2", color: c.stock > 0 ? "#16a34a" : "#dc2626" }}>
                    {c.stock > 0 ? c.stock : "Hết"}
                  </span>
                </td>
                <td>{c.connection}</td>
                <td>{c.rating}/5</td>
                <td>
                  <div className="flex gap-1">
                    <Button variant="secondary" size="small" onClick={() => openEditModal(c)}>Sửa</Button>
                    <Button variant="danger" size="small" onClick={() => handleDelete(c._id)}>Xóa</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {controllers.length === 0 && (
          <div className="text-center" style={{ padding: "3rem" }}>
            <p style={{ color: "#6b7280" }}>Chưa có sản phẩm nào.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: "1.5rem" }}>{editingController ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
            <form onSubmit={handleSubmit}>
              {formError && <div className="error-message" style={{ marginBottom: "1rem" }}>{formError}</div>}

              <div className="form-group">
                <label className="form-label">Tên sản phẩm *</label>
                <Input name="name" value={formData.name} onChange={handleChange} required placeholder="VD: DualSense Wireless Controller" />
              </div>

              <div className="form-group">
                <label className="form-label">Thương hiệu *</label>
                <Input name="brand" value={formData.brand} onChange={handleChange} required placeholder="VD: Sony, Microsoft, Nintendo" />
              </div>

              <div className="flex gap-2">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Giá ($) *</label>
                  <Input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="59.99" step="0.01" min="0" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Tồn kho *</label>
                  <Input type="number" name="stock" value={formData.stock} onChange={handleChange} required placeholder="10" min="0" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kết nối *</label>
                <Dropdown name="connection" value={formData.connection} onChange={handleChange} options={CONNECTION_OPTIONS} placeholder="Chọn loại kết nối" />
              </div>

              <div className="form-group">
                <label className="form-label">Đánh giá (0-5)</label>
                <Input type="number" name="rating" value={formData.rating} onChange={handleChange} placeholder="4.5" step="0.1" min="0" max="5" />
              </div>

              <div className="form-group">
                <label className="form-label">URL hình ảnh</label>
                <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả chi tiết sản phẩm..." rows={3} className="input" style={{ resize: "vertical" }} />
              </div>

              <div className="form-group">
                <label className="form-label">Tương thích</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {COMPATIBILITY_OPTIONS.map((opt) => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="compatibility"
                        value={opt}
                        checked={formData.compatibility.includes(opt)}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-2" style={{ justifyContent: "flex-end" }}>
                <Button type="button" variant="secondary" onClick={closeModal}>Hủy</Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Đang lưu..." : (editingController ? "Cập nhật" : "Tạo mới")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;