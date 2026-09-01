import { useNavigate, useLocation } from "react-router-dom";
import "../admin/Admin.css"; // Mengarah ke file CSS admin

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin", { replace: true });
  };

  // Helper untuk mengecek apakah route/halaman sedang aktif
  const isActive = (path) => {
    return location.pathname === path ? "admin-menu-active" : "";
  };

  return (
    <aside className="admin-sidebar">
      {/* LOGO ADMIN */}
      <div className="admin-sidebar-logo">
        <div className="admin-logo-small">✚</div>
        <div>
          <strong>PT MMA</strong>
          <span>Admin Panel</span>
        </div>
      </div>

      {/* MENU NAVIGASI */}
      <nav className="admin-menu">
        <button
          className={isActive("/admin/dashboard")}
          onClick={() => navigate("/admin/dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          className={isActive("/admin/products")}
          onClick={() => navigate("/admin/products")}
        >
          📦 Produk
        </button>

        <button
          className={isActive("/admin/articles")}
          onClick={() => navigate("/admin/articles")}
        >
          📰 Artikel
        </button>

        <button
          className={isActive("/admin/services")}
          onClick={() => navigate("/admin/services")}
        >
          🛠️ Layanan
        </button>

        <button
          className={isActive("/admin/users")}
          onClick={() => navigate("/admin/users")}
        >
          👥 Pengguna
        </button>
      </nav>

      {/* TOMBOL LOGOUT */}
      <button className="admin-logout" onClick={handleLogout}>
        ↪ Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;