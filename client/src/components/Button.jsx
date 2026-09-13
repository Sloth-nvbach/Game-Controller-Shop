// Button dùng cho mọi nút bấm trong trang web
// variant: "primary" | "secondary" | "danger"
// size: "small" | "medium" | "large"
function Button(props) {
  // Lấy các giá trị truyền vào, có giá trị mặc định
  const variant = props.variant || "primary";
  const size = props.size || "medium";
  const type = props.type || "button";
  const disabled = props.disabled || false;

  // Ghép các class CSS lại với nhau theo lựa chọn của người dùng
  const className =
    "btn " + "btn-" + variant + " btn-" + size + " " + (props.className || "");

  return (
    <button
      type={type}
      className={className.trim()}
      disabled={disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
