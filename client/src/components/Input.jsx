// Input dùng cho các ô nhập liệu (tìm kiếm, form đăng nhập,...)
// Có thể kèm nhãn (label) và thông báo lỗi (error)
function Input(props) {
  return (
    <div className="input-group">
      {/* Chỉ hiện nhãn nếu người dùng truyền vào */}
      {props.label && <label className="input-label">{props.label}</label>}

      <input
        type={props.type || "text"}
        className="input"
        placeholder={props.placeholder || ""}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
      />

      {/* Chỉ hiện lỗi nếu có */}
      {props.error && <p className="input-error">{props.error}</p>}
    </div>
  );
}

export default Input;
