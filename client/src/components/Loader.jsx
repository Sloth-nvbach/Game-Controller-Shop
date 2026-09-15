export function Loading({ text = "Đang tải..." }) {
  return (
    <div className="flex text-center mt-2" style={{ justifyContent: "center" }}>
      <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
      <span className="ml-2">{text}</span>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card" style={{ borderColor: "#dc2626", color: "#dc2626", maxWidth: "600px", margin: "2rem auto" }}>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary mt-1" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}