import "./AdminModal.css";

function AdminModal({
  isOpen,
  type = "success",
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Batal",
}) {
  if (!isOpen) return null;

  const isConfirm = type === "confirm";
  const isError = type === "error";

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-box">

        {/* ICON */}
        <div
          className={`admin-modal-icon ${
            isError
              ? "error"
              : isConfirm
              ? "confirm"
              : "success"
          }`}
        >
          {isError ? "!" : isConfirm ? "?" : "✓"}
        </div>

        {/* TITLE */}
        <h2>
          {title ||
            (isError
              ? "Terjadi Kesalahan"
              : isConfirm
              ? "Konfirmasi"
              : "Berhasil")}
        </h2>

        {/* MESSAGE */}
        <p>
          {message}
        </p>

        {/* BUTTON */}
        <div className="admin-modal-actions">

          {isConfirm && (
            <button
              type="button"
              className="admin-modal-cancel"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className={`admin-modal-confirm ${
              isError
                ? "error"
                : isConfirm
                ? "confirm"
                : "success"
            }`}
            onClick={onConfirm}
          >
            {isConfirm ? "Ya, Hapus" : confirmText}
          </button>

        </div>

      </div>
    </div>
  );
}

export default AdminModal;

