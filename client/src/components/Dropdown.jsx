// Dropdown dùng cho các ô chọn (lọc theo hãng, sắp xếp giá,...)
// options là một mảng các object dạng: { value: "xbox", label: "Xbox" }
function Dropdown(props) {
  const options = props.options || [];

  return (
    <div className="input-group">
      {props.label && <label className="input-label">{props.label}</label>}

      <select
        className="input"
        value={props.value}
        name={props.name}
        onChange={props.onChange}
      >
        {/* Dòng đầu tiên làm gợi ý cho người dùng */}
        <option value="">{props.placeholder || "-- Chọn --"}</option>

        {options.map(function (option) {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Dropdown;
